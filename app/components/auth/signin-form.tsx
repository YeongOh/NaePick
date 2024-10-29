'use client';

import { signin, SigninState } from '@/app/lib/actions/auth/signin';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import Input from '../ui/input';
import InputErrorMessage from '../ui/input-error-message';
import Button from '../ui/button';

export default function SigninForm() {
  const initialState: SigninState = { message: null, errors: {} };
  const [state, signinAction] = useFormState(signin, initialState);

  return (
    <form
      action={signinAction}
      className='rounded-md flex flex-col w-full -translate-y-1/4'
    >
      <Link
        href='/'
        className='text-primary-500 text-5xl text-center m-4 font-extrabold'
      >
        NaePick
      </Link>
      <p className='text-center text-base mb-6 text-slate-700'>
        이상형 월드컵 NaePick에 오신 걸 환영합니다!
      </p>
      <Input
        id='email'
        name='email'
        type='text'
        className={`p-4 mb-2`}
        error={state.errors?.email}
        placeholder={`이메일 주소`}
        autoFocus
      />
      <InputErrorMessage className='mb-2' errors={state.errors?.email} />
      <Input
        id='password'
        name='password'
        type='password'
        className={`p-4 mb-2`}
        error={state.errors?.password}
        placeholder={`비밀번호`}
      />
      <InputErrorMessage errors={state.errors?.password} />
      <Button className='mt-4' variant='primary'>
        로그인
      </Button>
      <Link
        className='mt-4 text-blue-600 hover:underline text-center text-base'
        href={'/signup'}
      >
        회원가입
      </Link>
    </form>
  );
}
