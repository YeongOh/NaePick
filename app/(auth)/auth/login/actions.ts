"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createSession } from "@/app/lib/session";
import { findUserWithEmail } from "@/app/lib/auth/service";
import { verifyPassword } from "@/app/lib/auth/utils";

const FormSchema = z.object({
  email: z.string().email({ message: "올바른 이메일이 아닙니다." }),
  password: z.string(),
});

export type SigninState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

export async function loginAction(state: SigninState, formData: FormData) {
  const validatedFields = FormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "필수 항목이 누락되었습니다.",
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const result = await findUserWithEmail(email);
    console.log(result);
    const user = result?.[0];
    if (!user)
      return {
        errors: {
          email: ["등록되지 않은 이메일입니다."],
        },
      };

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword)
      return {
        errors: {
          password: ["비밀번호가 틀렸습니다."],
        },
      };

    const { userId, nickname, profilePath } = user;

    await createSession({ userId, nickname, profilePath });
  } catch (error) {
    console.error(error);
    return {
      message: "로그인에 실패하였습니다.",
    };
  }

  redirect("/");
}
