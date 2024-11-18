'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import Button from '@/app/components/ui/Button';
import FormError from '@/app/components/ui/FormError';
import FormInput from '@/app/components/ui/FormInput';

import { loginAction } from '../actions';
import { loginFormSchema, TLoginFormSchema } from '../types';

export default function SigninForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<TLoginFormSchema>({ resolver: zodResolver(loginFormSchema) });

  const onSubmit = async (data: TLoginFormSchema) => {
    const result = await loginAction(data);
    if (!result?.errors) return;

    const errors = result.errors;
    if ('email' in errors) {
      setError('email', { type: 'server', message: errors.email });
    } else if ('password' in errors) {
      setError('password', { type: 'server', message: errors.password });
    } else if ('server' in errors) {
      toast.error(errors.server);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-28 flex w-full flex-col rounded-md">
      <Link href="/" className="m-4 text-center text-5xl font-extrabold text-primary-500">
        NaePick
      </Link>
      <p className="mb-6 text-center text-base text-slate-700">
        이상형 월드컵 NaePick에 오신 것을 환영합니다!
      </p>
      <FormInput
        id={'email'}
        {...register('email')}
        type="text"
        className={`mb-2 p-4`}
        error={errors?.email}
        placeholder={`이메일 주소`}
      />
      <FormError className="mb-2" error={errors?.email?.message} />
      <FormInput
        id={'password'}
        {...register('password')}
        type="password"
        className={`mb-2 p-4`}
        error={errors?.password}
        placeholder={`비밀번호`}
      />
      <FormError className="mb-2" error={errors?.password?.message} />
      <Button pending={isSubmitting} className="mt-4 w-full" variant="primary">
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
