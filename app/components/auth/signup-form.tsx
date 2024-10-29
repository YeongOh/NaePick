'use client';

import { signup, SignupState } from '@/app/lib/actions/auth/signup';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import Input from '../ui/input';
import InputErrorMessage from '../ui/input-error-message';
import { NICKNAME_MAX_LENGTH, NICKNAME_MIN_LENGTH } from '@/app/constants';
import Button from '../ui/button';

export default function SignupForm() {
  const initialState: SignupState = { message: null, errors: {} };
  const [state, submitSignupForm] = useFormState(signup, initialState);

  return (
    <form
      action={submitSignupForm}
      className='rounded-md flex flex-col w-full -translate-y-1/4'
    >
      <Link
        href='/'
        className='text-primary-500 text-5xl text-center m-4 font-extrabold'
      >
        NaePick
      </Link>
      <p className='text-center text-base mb-6 text-slate-700'>
        이상형 월드컵 NaePick에 오신 걸 환영합니다! <br />
        간단한 회원가입 후 이상형 월드컵을 만들어보세요!
      </p>
      <Input
        id='email'
        name='email'
        type='text'
        className={`p-4 mb-2`}
        error={state.errors?.email}
        placeholder={`이메일`}
        autoFocus
      />
      <InputErrorMessage className='mb-2' errors={state.errors?.email} />
      <Input
        id='nickname'
        name='nickname'
        className={`p-4 mb-2`}
        error={state.errors?.nickname}
        placeholder={`닉네임 (${NICKNAME_MIN_LENGTH} ~ ${NICKNAME_MAX_LENGTH}자)`}
      />
      <InputErrorMessage className='mb-2' errors={state.errors?.nickname} />
      <Input
        id='password'
        name='password'
        type='password'
        className={`p-4 mb-2`}
        error={state.errors?.password}
        placeholder={`비밀번호 (문자, 숫자, 특수 문자 포함 8자 이상)`}
      />
      <InputErrorMessage className='mb-2' errors={state.errors?.password} />
      <Input
        id='confirmPassword'
        name='confirmPassword'
        type='password'
        className={`p-4 mb-2`}
        error={state.errors?.confirmPassword}
        placeholder={`비밀번호 재입력`}
      />
      <InputErrorMessage
        className='mb-2'
        errors={state.errors?.confirmPassword}
      />
      <Button variant='primary' className='mt-4'>
        가입 완료
      </Button>
    </form>
  );
}
