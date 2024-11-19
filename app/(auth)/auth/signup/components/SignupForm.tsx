'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { NICKNAME_MAX_LENGTH, NICKNAME_MIN_LENGTH } from '@/app/constants';
import Button from '@/app/ui/Button';
import FormError from '@/app/ui/FormError';
import FormInput from '@/app/ui/FormInput';

import { signupAction } from '../action';
import { signupFormSchema, TSignupFormSchema } from '../types';

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<TSignupFormSchema>({ resolver: zodResolver(signupFormSchema), mode: 'onChange' });

  const onSubmit = async (data: TSignupFormSchema) => {
    const result = await signupAction(data);
    if (!result?.errors) {
      toast.success('회원가입을 축하드립니다!');
      return;
    }

    const errors = result.errors;
    if ('email' in errors && typeof errors.email === 'string') {
      setError('email', { type: 'server', message: errors.email });
    } else if ('password' in errors && typeof errors.password === 'string') {
      setError('password', { type: 'server', message: errors.password });
    } else if ('server' in errors && typeof errors.server === 'string') {
      toast.error(errors.server);
    } else {
      toast.error('예기치 못한 오류가 발생했습니다.');
    }
  };

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="absolute top-[20%] flex w-full flex-col"
      onKeyDown={handleFormKeyDown}
    >
      <Link href="/" className="m-4 text-center text-5xl font-extrabold text-primary-500">
        NaePick
      </Link>
      <p className="mb-6 text-center text-base text-slate-700">
        이상형 월드컵 NaePick에 오신 것을 환영합니다! <br />
        간단한 회원가입 후 이상형 월드컵을 만들어 보세요!
      </p>
      <FormInput
        id="email"
        {...register('email')}
        type="text"
        className={`mb-2 p-4`}
        error={errors?.email}
        placeholder={`이메일`}
      />
      <FormError className="mb-2" error={errors?.email?.message} />
      <FormInput
        id="nickname"
        {...register('nickname')}
        className={`mb-2 p-4`}
        error={errors?.nickname}
        placeholder={`닉네임 (${NICKNAME_MIN_LENGTH} ~ ${NICKNAME_MAX_LENGTH}자)`}
      />
      <FormError className="mb-2" error={errors?.nickname?.message} />
      <FormInput
        id="password"
        {...register('password')}
        type="password"
        className={`mb-2 p-4`}
        error={errors?.password}
        placeholder={`비밀번호 (문자, 숫자, 특수 문자 포함 8자 이상)`}
      />
      <FormError className="mb-2" error={errors?.password?.message} />
      <FormInput
        id="confirmPassword"
        {...register('confirmPassword')}
        type="password"
        className={`mb-2 p-4`}
        error={errors?.confirmPassword}
        placeholder={`비밀번호 재입력`}
      />
      <FormError className="mb-2" error={errors?.confirmPassword?.message} />
      <Button pending={isSubmitting} variant="primary" className="mt-4 w-full">
        가입하기
      </Button>
    </form>
  );
}
