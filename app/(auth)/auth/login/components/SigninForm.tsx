'use client';

import Button from '@/app/components/ui/button';
import Input from '@/app/components/ui/input';
import InputErrorMessage from '@/app/components/ui/input-error-message';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { loginAction, SigninState } from '../actions';

export default function SigninForm() {
  const initialState: SigninState = { message: null, errors: {} };
  const [state, submitSignin] = useFormState(loginAction, initialState);

  const handleSigninSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    submitSignin(formData);
  };

  return (
    <form onSubmit={handleSigninSubmit} className="mb-28 flex w-full flex-col rounded-md">
      <Link href="/" className="m-4 text-center text-5xl font-extrabold text-primary-500">
        NaePick
      </Link>
      <p className="mb-6 text-center text-base text-slate-700">
        이상형 월드컵 NaePick에 오신 것을 환영합니다!
      </p>
      <Input
        id="email"
        name="email"
        type="text"
        className={`mb-2 p-4`}
        error={state.errors?.email}
        placeholder={`이메일 주소`}
      />
      <InputErrorMessage className="mb-2" errors={state.errors?.email} />
      <Input
        id="password"
        name="password"
        type="password"
        className={`mb-2 p-4`}
        error={state.errors?.password}
        placeholder={`비밀번호`}
      />
      <InputErrorMessage errors={state.errors?.password} />
      <Button className="mt-4" variant="primary">
        로그인
      </Button>
      <div className="mt-4 flex justify-center gap-2 text-center text-base text-gray-500">
        아직 회원이 아니신가요?
      </div>
      <Link className="mt-1 text-center text-base text-blue-600 hover:underline" href={'/auth/signup'}>
        회원가입하기
      </Link>
    </form>
  );
}
