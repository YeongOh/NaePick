'use client';

import { useCallback, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Info } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileRejection, FileWithPath, useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import DeleteModal from '@/app/components/NewModal/DeleteModal';
import Button from '@/app/components/ui/Button';
import FormError from '@/app/components/ui/FormError';
import FormInput from '@/app/components/ui/FormInput';
import NewAvatar from '@/app/components/ui/NewAvatar';

import { signout } from '../../signout/actions';
import {
  deleteAccountAction,
  deleteProfileImage,
  editUserAction,
  getSignedUrlForProfileImage,
  updateUserProfilePathAction,
} from '../actions';
import { EditFormSchema, TEditFormSchema } from '../types';

interface Props {
  nickname: string;
  profilePath: string | null;
  userId: string;
  email: string;
}

export default function EditUserForm({ nickname, userId, profilePath, email }: Props) {
  const [openDeleteProfileModal, setOpenDeleteProfileModal] = useState(false);
  const [openDeleteAccountModal, setOpenDeleteAccountModal] = useState(false);
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const router = useRouter();

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      const file = acceptedFiles[0];
      try {
        if (profilePath !== null) await deleteProfileImage(profilePath);

        const result = await getSignedUrlForProfileImage(file.path as string, file.type);
        if (!result?.url) {
          throw new Error('프로필 이미지 업로드에 실패했습니다.');
        }

        const { profilePath: newProfilePath, url } = result;
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });
        if (!response.ok) {
          throw new Error('프로필 이미지 변경에 실패했습니다.');
        }

        await updateUserProfilePathAction(newProfilePath);
        toast.success('이미지를 수정했습니다!');
      } catch (error) {
        toast.error('오류가 발생했습니다.');
      }
    },
    [profilePath],
  );

  const handleDeleteProfileImage = async () => {
    await deleteProfileImage(userId);
    if (profilePath === null) {
      toast.error('삭제할 프로필 이미지가 없습니다.');
      return;
    }
    try {
      await deleteProfileImage(profilePath);
      await updateUserProfilePathAction(null);
      toast.success('프로필 이미지를 삭제했습니다.');
    } catch (error) {
      toast.error('오류가 발생했습니다.');
    } finally {
      setOpenDeleteProfileModal(false);
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

  const onDropRejected = useCallback((rejectedFiles: FileRejection[]) => {
    toast.error('지원하지 않는 파일 형식이거나 파일 크기 제한을 초과했습니다.');
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    maxSize: 10485760,
    maxFiles: 1,
    accept: {
      'image/png': [],
      'image/jpg': [],
      'image/jpeg': [],
      'image/webp': [],
      'image/svg': [],
      'image/tiff': [],
    },
    onDrop,
    onDropRejected,
    noDrag: true,
  });

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
    }
  };

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  return (
    <form
      onSubmit={handleEditUserFormSubmit(onEditUserFormSubmit)}
      className="mb-20 flex w-full flex-col rounded-md"
      onKeyDown={handleFormKeyDown}
    >
      <Link href="/" className="mb-8 text-center text-5xl font-extrabold text-primary-500">
        NaePick
      </Link>
      <div className="mb-4 flex flex-col items-center">
        <NewAvatar alt={'내 프로필 이미지'} profilePath={profilePath} size="lg" className="mb-2" />
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <p className="cursor-pointer text-base text-blue-500 hover:underline">프로필 이미지 변경</p>
        </div>
        {profilePath !== null ? (
          <button
            type="button"
            className="cursor-pointer text-base text-gray-500 hover:underline"
            onClick={() => setOpenDeleteProfileModal(true)}
          >
            프로필 이미지 삭제
          </button>
        ) : null}
        <p className="mt-2 flex items-center justify-center text-base text-gray-500">
          <Info size="1.1rem" className="mr-1" /> 이미지 크기는 80x80px를 추천합니다.
        </p>
      </div>
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
        className="mb-4 mt-2 w-full"
        role="link"
      >
        돌아가기
      </Button>
      <button
        type="button"
        onClick={() => setOpenDeleteAccountModal(true)}
        className="text-base text-red-500"
      >
        회원 탈퇴
      </button>
      <DeleteModal
        open={openDeleteAccountModal}
        title={'정말로 회원을  탈퇴하시겠습니까?'}
        description="모든 회원 정보가 삭제됩니다. 탈퇴 후 닉네임은 '탈퇴한 회원'으로 표시되지만, 생성하신 월드컵과 댓글은 그대로 남게 됩니다."
        onClose={() => setOpenDeleteAccountModal(false)}
        onConfirm={handleDeleteAccount}
      />
      <DeleteModal
        open={openDeleteProfileModal}
        title={'프로필 이미지를 삭제하시겠습니까?'}
        description=""
        onClose={() => setOpenDeleteProfileModal(false)}
        onConfirm={handleDeleteProfileImage}
      />
    </form>
  );
}
