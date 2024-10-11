'use client';

import { signup } from '@/app/lib/actions/signup';
import { SignupState } from '@/app/lib/auth';
import Link from 'next/link';
import { useFormState } from 'react-dom';

export default function SignupForm() {
  const initialState: SignupState = { message: null, errors: {} };
  const [state, action] = useFormState(signup, initialState);

  return (
    <form action={action}>
      <div className='rounded-md bg-gray-50 p-6'>
        <div className='text-center font-semibold mb-4 text-lg'>
          이상형 월드컵 Pick에 오신걸 환영합니다.
        </div>
        <div className='text-center font-medium mb-4'>
          입력하신 이메일로 어떠한 메일도 발신되지 않으며
          <br></br>
          회원 탈퇴시 모든 정보가 완전히 제거됩니다.
        </div>
        <label htmlFor='username' className='ml-2 mb-2 block font-semibold'>
          회원 아이디
        </label>
        <input
          id='username'
          name='username'
          type='text'
          className={`block w-full rounded-md border mb-4 border-gray-200 py-2 pl-4 placeholder:text-gray-500 focus:outline-teal-500 
              ${state.errors?.username && 'outline outline-1 outline-red-500'}`}
          placeholder={`로그인에 사용될 아이디를 입력해주세요. `}
          aria-describedby='username-error'
          autoFocus
        />
        <div id='username-error' aria-live='polite' aria-atomic='true'>
          {state.errors?.username &&
            state.errors.username.map((error: string) => (
              <p className='m-2 mb-4 text-red-500' key={error}>
                {error}
              </p>
            ))}
        </div>
        <label htmlFor='email' className='ml-2 mb-2 block font-semibold'>
          이메일
        </label>
        <input
          id='email'
          name='email'
          type='email'
          className={`block w-full rounded-md border mb-4 border-gray-200 py-2 pl-4 placeholder:text-gray-500 focus:outline-teal-500 
              ${state.errors?.email && 'outline outline-1 outline-red-500'}`}
          placeholder={`example@google.com`}
          aria-describedby='email-error'
        />
        {state.errors?.email &&
          state.errors.email.map((error: string) => (
            <p className='m-2 mb-4 text-red-500' key={error}>
              {error}
            </p>
          ))}
        <label htmlFor='nickname' className='ml-2 mb-2 block font-semibold'>
          닉네임
        </label>
        <input
          id='nickname'
          name='nickname'
          type='text'
          className={`block w-full rounded-md border mb-4 border-gray-200 py-2 pl-4 placeholder:text-gray-500 focus:outline-teal-500 
              ${state.errors?.nickname && 'outline outline-1 outline-red-500'}`}
          placeholder={`다른 사람들에게 표시될 닉네임을 입력해주세요.`}
          aria-describedby='nickname-error'
        />
        {state.errors?.nickname &&
          state.errors.nickname.map((error: string) => (
            <p className='m-2 mb-4 text-red-500' key={error}>
              {error}
            </p>
          ))}
        <label htmlFor='password' className='ml-2 mb-2 block font-semibold'>
          비밀번호
        </label>
        <input
          id='password'
          name='password'
          type='password'
          className={`block w-full rounded-md border mb-4 border-gray-200 py-2 pl-4 placeholder:text-gray-500 focus:outline-teal-500 
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
        <label
          htmlFor='confirmPassword'
          className='ml-2 mb-2 block font-semibold'
        >
          비밀번호 재입력
        </label>
        <input
          id='confirmPassword'
          name='confirmPassword'
          type='password'
          className={`block w-full rounded-md border mb-4 border-gray-200 py-2 pl-4 placeholder:text-gray-500 focus:outline-teal-500 
              ${
                state.errors?.confirmPassword &&
                'outline outline-1 outline-red-500'
              }`}
          placeholder={`비밀번호를 재입력해주세요.`}
          aria-describedby='confirmPassword-error'
        />
        {state.errors?.confirmPassword &&
          state.errors.confirmPassword.map((error: string) => (
            <p className='m-2 mb-4 text-red-500' key={error}>
              {error}
            </p>
          ))}
      </div>
      <div className='flex gap-4 m-4 justify-end'>
        <button className='bg-teal-500 px-4 flex h-12 items-center rounded-lg text-white font-semibold'>
          가입하기
        </button>
        <Link
          href={'/posts/'}
          className='bg-gray-100 px-4 flex h-12 items-center rounded-lg font-semibold text-gray-600'
        >
          취소
        </Link>
      </div>
    </form>
  );
}
