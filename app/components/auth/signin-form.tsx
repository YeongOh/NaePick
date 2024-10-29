'use client';

import { signin, SigninState } from '@/app/lib/actions/auth/signin';
import Link from 'next/link';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import toast from 'react-hot-toast';
import Input from '../ui/input/input';

export default function SigninForm() {
  const initialState: SigninState = { message: null, errors: {} };
  const [state, action] = useFormState(signin, initialState);

  useEffect(() => {
    if (state.errors?.email) {
      const msg = state.errors.email.map((error) => error).join();
      toast.error(msg);
    }
    if (state.errors?.password) {
      const msg = state.errors.password.map((error) => error).join();
      toast.error(msg);
    }
  }, [state.errors]);

  return (
    <form
      action={action}
      className='rounded-md flex flex-col w-full -translate-y-1/4'
    >
      <h1 className='text-primary-500 text-5xl text-center m-8 font-extrabold'>
        NaePick
      </h1>
      <div className='text-center text-base mb-6 text-slate-700'>
        이상형 월드컵 NaePick에 오신걸 환영합니다!
      </div>
      <Input
        id='email'
        name='email'
        type='text'
        className={`mb-2 p-4`}
        error={state.errors?.email}
        placeholder={`이메일 주소`}
        autoFocus
      />
      <Input
        id='password'
        name='password'
        type='password'
        className={`p-4 mb-6`}
        error={state.errors?.password}
        placeholder={`비밀번호`}
      />
      <div className='flex'>
        <button className='flex-1 bg-primary-500 text-white font-semibold py-3 px-2 rounded'>
          로그인
        </button>
      </div>
      <div className='flex mt-4 text-blue-600 hover:underline'>
        <Link className='text-base m-auto' href={'/signup'}>
          회원가입
        </Link>
      </div>
    </form>
  );
}
