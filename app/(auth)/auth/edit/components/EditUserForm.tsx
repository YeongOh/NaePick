'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import DeleteConfirmModal from '@/app/components/Modal/DeleteConfirmModal';
import Button from '@/app/ui/Button';
import FormError from '@/app/ui/FormError';
import FormInput from '@/app/ui/FormInput';

import { deleteAccountAction, editUserAction } from '../actions';
import { EditFormSchema, TEditFormSchema } from '../types';
import EditAvatar from './EditAvatar';
import { signout } from '../../signout/actions';

interface Props {
  nickname: string;
  profilePath: string | null;
  userId: string;
  email: string;
}

export default function EditUserForm({ nickname, userId, profilePath, email }: Props) {
  const [openDeleteAccountModal, setOpenDeleteAccountModal] = useState(false);
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit: handleEditUserFormSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<TEditFormSchema>({ resolver: zodResolver(EditFormSchema), mode: 'onChange' });

  const onEditUserFormSubmit = async (data: TEditFormSchema) => {
    const result = await editUserAction(data);
    if (!result?.errors) {
      toast.success('회원 정보가 수정되었습니다.');
      return;
    }

    const errors = result.errors;
    if ('session' in errors) {
      toast.error(errors.session as string);
    } else if ('userId' in errors) {
      toast.error(errors.userId as string);
    } else if ('oldPassword' in errors) {
      setError('oldPassword', { type: 'server', message: errors.oldPassword });
    } else if ('nickname' in errors) {
      setError('nickname', { type: 'server', message: errors.nickname });
    } else if ('server' in errors) {
      toast.error(errors.server);
    } else {
      toast.error('예기치 못한 오류가 발생했습니다.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccountAction();
      await signout();
    } catch (error) {
      toast.error('오류가 발생했습니다.');
    }
  };

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  return (
    <form
      onSubmit={handleEditUserFormSubmit(onEditUserFormSubmit)}
      className="absolute top-[7%] flex w-full flex-col"
      onKeyDown={handleFormKeyDown}
    >
      <Link href="/" className="mb-8 text-center text-5xl font-extrabold text-primary-500">
        NaePick
      </Link>
      <EditAvatar userId={userId} profilePath={profilePath} />
      <FormInput
        id="email"
        name="email"
        type="email"
        className={`mb-2 p-4`}
        defaultValue={email}
        placeholder={'이메일 주소'}
        disabled
        readOnly
      />
      <FormInput
        id="nickname"
        {...register('nickname')}
        type="text"
        className={`mb-2 p-4`}
        error={errors?.nickname}
        defaultValue={nickname}
        placeholder={'닉네임'}
      />
      <FormError className="mb-2" error={errors?.nickname?.message} />
      <FormInput
        id="oldPassword"
        {...register('oldPassword')}
        type="password"
        error={errors?.oldPassword}
        className={`mb-2 p-4`}
        placeholder={`비밀번호`}
      />
      <FormError className="mb-2" error={errors?.oldPassword?.message} />
      <div className="mb-4 flex gap-2 pl-2">
        <input
          type="checkbox"
          id="changePassword"
          name="changePassword"
          checked={changePassword}
          className="peer/change-password cursor-pointer"
          onChange={() => setChangePassword((prev) => !prev)}
        />
        <label
          htmlFor="changePassword"
          className="cursor-pointer text-base font-semibold text-gray-500 peer-checked/change-password:text-primary-500"
        >
          비밀번호 변경
        </label>
      </div>
      <FormInput
        id="newPassword"
        {...register('newPassword')}
        type="password"
        error={errors?.newPassword}
        disabled={!changePassword}
        className={`mb-2 p-4`}
        placeholder={`새로운 비밀번호`}
      />
      <FormError className="mb-2" error={errors?.newPassword?.message} />
      <FormInput
        id="confirmNewPassword"
        {...register('confirmNewPassword')}
        type="password"
        error={errors?.confirmNewPassword}
        disabled={!changePassword}
        className={`mb-2 p-4`}
        placeholder={`새로운 비밀번호 재입력`}
      />
      <FormError className="mb-2" error={errors?.confirmNewPassword?.message} />
      <Button pending={isSubmitting} className="mt-4 w-full" variant="primary">
        수정 완료
      </Button>
      <Button
        type="button"
        onClick={() => router.back()}
        variant="outline"
        className="my-2 w-full"
        role="link"
      >
        돌아가기
      </Button>
      <div className="my-2 flex justify-center gap-2 text-center text-base text-gray-500">
        건의 및 문의: penny0723@naver.com
      </div>
      <button
        type="button"
        onClick={() => setOpenDeleteAccountModal(true)}
        className="text-base text-red-500"
      >
        회원 탈퇴
      </button>
      <DeleteConfirmModal
        open={openDeleteAccountModal}
        title={'정말로 회원을  탈퇴하시겠습니까?'}
        description="모든 회원 정보가 삭제됩니다. 탈퇴 후 닉네임은 '탈퇴한 회원'으로 표시되지만, 생성하신 월드컵과 댓글은 그대로 남게 됩니다."
        onClose={() => setOpenDeleteAccountModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </form>
  );
}
