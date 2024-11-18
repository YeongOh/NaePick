import { users } from '@/app/lib/database/schema';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const loginFormSchema = createSelectSchema(users, {
  email: z.string().email({ message: '이메일이 올바르지 않습니다.' }),
  password: z.string().min(1, { message: '비밀번호를 입력해주세요.' }),
}).pick({ email: true, password: true });

export type TLoginFormSchema = z.infer<typeof loginFormSchema>;
