'use client';

import { signin, SigninState } from '@/app/lib/actions/auth/signin';
import Link from 'next/link';
import { useFormState } from 'react-dom';

export default function SigninForm() {
  const initialState: SigninState = { message: null, errors: {} };
  const [state, action] = useFormState(signin, initialState);

  return (
    <form action={action}>
      <div className='rounded-md bg-gray-50 p-6'>
        <div className='text-center font-semibold mb-4 text-lg'>
          이상형 월드컵 NaePick에 오신걸 환영합니다!
        </div>
        <div className='text-center font-medium mb-2'>처음이신가요?</div>
        <div className='flex justify-center mb-4'>
          <Link
            className='text-center text-primary-600 font-bold underline'
            href={'/signup'}
          >
            가입하기
          </Link>
        </div>
        <label htmlFor='email' className='ml-2 mb-2 block font-semibold'>
          이메일
        </label>
        <input
          id='email'
          name='email'
          type='text'
          className={`block w-full rounded-md border mb-4 border-gray-200 py-2 pl-4 placeholder:text-gray-500 focus:outline-primary-500 
              ${state.errors?.email && 'outline outline-1 outline-red-500'}`}
          placeholder={`이메일을 입력해주세요.`}
          aria-describedby='email-error'
          autoComplete='off'
          autoFocus
        />
        <div id='email-error' aria-live='polite' aria-atomic='true'>
          {state.errors?.email &&
            state.errors.email.map((error: string) => (
              <p className='m-2 mb-4 text-red-500' key={error}>
                {error}
              </p>
            ))}
        </div>
        <label htmlFor='password' className='ml-2 mb-2 block font-semibold'>
          비밀번호
        </label>
        <input
          id='password'
          name='password'
          type='password'
          className={`block w-full rounded-md border mb-4 border-gray-200 py-2 pl-4 placeholder:text-gray-500 focus:outline-primary-500 
              ${state.errors?.password && 'outline outline-1 outline-red-500'}`}
          placeholder={`비밀번호를 입력해주세요.`}
          aria-describedby='password-error'
        />
        {state.errors?.password &&
          state.errors.password.map((error: string) => (
            <p className='m-2 mb-4 text-red-500' key={error}>
              {error}
            </p>
          ))}
      </div>
      <div className='flex gap-4 m-4 justify-end '>
        <button className='bg-primary-500 px-4 flex h-12 items-center rounded-lg text-white font-semibold'>
          로그인
        </button>
        <Link
          href={'/'}
          className='bg-gray-100 px-4 flex h-12 items-center rounded-lg font-semibold text-gray-600'
        >
          취소
        </Link>
      </div>
    </form>
  );
}
