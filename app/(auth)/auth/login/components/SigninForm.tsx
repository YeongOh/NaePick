"use client";

import Button from "@/app/components/ui/button";
import Input from "@/app/components/ui/input";
import InputErrorMessage from "@/app/components/ui/input-error-message";
import Link from "next/link";
import { useFormState } from "react-dom";
import { loginAction, SigninState } from "../actions";

export default function SigninForm() {
  const initialState: SigninState = { message: null, errors: {} };
  const [state, submitSignin] = useFormState(loginAction, initialState);

  const handleSigninSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    submitSignin(formData);
  };

  return (
    <form onSubmit={handleSigninSubmit} className="rounded-md flex flex-col w-full mb-28">
      <Link href="/" className="text-primary-500 text-5xl text-center m-4 font-extrabold">
        NaePick
      </Link>
      <p className="text-center text-base mb-6 text-slate-700">
        이상형 월드컵 NaePick에 오신 것을 환영합니다!
      </p>
      <Input
        id="email"
        name="email"
        type="text"
        className={`p-4 mb-2`}
        error={state.errors?.email}
        placeholder={`이메일 주소`}
        autoFocus
      />
      <InputErrorMessage className="mb-2" errors={state.errors?.email} />
      <Input
        id="password"
        name="password"
        type="password"
        className={`p-4 mb-2`}
        error={state.errors?.password}
        placeholder={`비밀번호`}
      />
      <InputErrorMessage errors={state.errors?.password} />
      <Button className="mt-4" variant="primary">
        로그인
      </Button>
      <div className="mt-4 text-center text-base flex gap-2 text-gray-500 justify-center">
        아직 회원이 아니신가요?
      </div>
      <Link className="text-blue-600 hover:underline text-center text-base mt-1" href={"/auth/signup"}>
        회원가입하기
      </Link>
    </form>
  );
}
