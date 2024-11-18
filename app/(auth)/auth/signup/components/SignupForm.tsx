'use client';

import Link from 'next/link';
import { useFormState } from 'react-dom';
import { NICKNAME_MAX_LENGTH, NICKNAME_MIN_LENGTH } from '@/app/constants';
import { signupAction, SignupState } from '../action';
import InputErrorMessage from '@/app/components/ui/input-error-message';
import Input from '@/app/components/ui/input';
import OldButton from '@/app/components/ui/OldButton/OldButton';

export default function SignupForm() {
  const initialState: SignupState = { message: null, errors: {} };
  const [state, submitSignupForm] = useFormState(signupAction, initialState);

  const handleSignupFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    submitSignupForm(formData);
  };

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  return (
    <form
      onSubmit={handleSignupFormSubmit}
      className="mb-36 flex w-full flex-col rounded-md"
      onKeyDown={handleFormKeyDown}
    >
      <Link href="/" className="m-4 text-center text-5xl font-extrabold text-primary-500">
        NaePick
      </Link>
      <p className="mb-6 text-center text-base text-slate-700">
        이상형 월드컵 NaePick에 오신 것을 환영합니다! <br />
        간단한 회원가입 후 이상형 월드컵을 만들어 보세요!
      </p>
      <Input
        id="email"
        name="email"
        type="text"
        className={`mb-2 p-4`}
        error={state.errors?.email}
        placeholder={`이메일`}
      />
      <InputErrorMessage className="mb-2" errors={state.errors?.email} />
      <Input
        id="nickname"
        name="nickname"
        className={`mb-2 p-4`}
        error={state.errors?.nickname}
        placeholder={`닉네임 (${NICKNAME_MIN_LENGTH} ~ ${NICKNAME_MAX_LENGTH}자)`}
      />
      <InputErrorMessage className="mb-2" errors={state.errors?.nickname} />
      <Input
        id="password"
        name="password"
        type="password"
        className={`mb-2 p-4`}
        error={state.errors?.password}
        placeholder={`비밀번호 (문자, 숫자, 특수 문자 포함 8자 이상)`}
      />
      <InputErrorMessage className="mb-2" errors={state.errors?.password} />
      <Input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        className={`mb-2 p-4`}
        error={state.errors?.confirmPassword}
        placeholder={`비밀번호 재입력`}
      />
      <InputErrorMessage className="mb-2" errors={state.errors?.confirmPassword} />
      <OldButton variant="primary" className="mt-4">
        가입하기
      </OldButton>
    </form>
  );
}
