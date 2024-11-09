'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { FileRejection, FileWithPath, useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { Info } from 'lucide-react';
import Avatar from '@/app/components/ui/Avatar';
import Input from '@/app/components/ui/input';
import InputErrorMessage from '@/app/components/ui/input-error-message';
import Button from '@/app/components/ui/button';
import DeleteConfirmModal from '@/app/components/modal/delete-confirm-modal';
import {
  deleteProfileImage,
  editUserAction,
  editUserState,
  getSignedUrlForProfileImage,
  updateUserProfilePathAction,
} from '../actions';
import { getUserProfilePath } from '@/app/lib/auth/service';

interface Props {
  nickname: string;
  profilePath: string | null;
  userId: string;
}

const fetcher = (url: string) => fetch(url).then((response) => response.json());

export default function EditUserForm({ nickname, userId, profilePath }: Props) {
  const initialState: editUserState = { message: null, errors: {} };
  const [state, submitEditUserForm] = useFormState(editUserAction, initialState);
  const [email, setEmail] = useState<string>('');
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [openDeleteProfileModal, setOpenDeleteProfileModal] = useState(false);
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
    [profilePath]
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

  useEffect(() => {
    fetch('/api/user')
      .then((response) => response.json())
      .then(({ email }) => {
        setEmail(email);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleEditUserFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('changePassword', String(changePassword));
    submitEditUserForm(formData);
  };

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  return (
    <form
      onSubmit={handleEditUserFormSubmit}
      className="rounded-md flex flex-col w-full mb-20"
      onKeyDown={handleFormKeyDown}
    >
      <Link href="/" className="text-primary-500 text-5xl text-center mb-8 font-extrabold">
        NaePick
      </Link>
      <div className="flex flex-col items-center mb-4">
        <Avatar alt={'내 프로필 이미지'} profilePath={profilePath} size="large" className="mb-2" />
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <p className="text-base text-blue-500 cursor-pointer hover:underline">프로필 이미지 변경</p>
        </div>
        {profilePath !== null ? (
          <button
            type="button"
            className="text-base text-gray-500 cursor-pointer hover:underline"
            onClick={() => setOpenDeleteProfileModal(true)}
          >
            프로필 이미지 삭제
          </button>
        ) : null}
        <p className="flex justify-center items-center text-base text-gray-500 mt-2">
          <Info size="1.1rem" className="mr-1" /> 이미지 크기는 80x80px를 추천합니다.
        </p>
      </div>
      <Input
        id="email"
        name="email"
        type="email"
        className={`p-4 mb-2`}
        defaultValue={email}
        placeholder={'이메일 주소'}
        disabled
        readOnly
      />
      <Input
        id="nickname"
        name="nickname"
        type="text"
        className={`p-4 mb-2`}
        error={state.errors?.nickname}
        defaultValue={nickname}
        placeholder={'닉네임'}
      />
      <InputErrorMessage className="mb-2" errors={state.errors?.nickname} />
      <Input
        id="oldPassword"
        name="oldPassword"
        type="password"
        error={state.errors?.oldPassword}
        className={`p-4 mb-2`}
        placeholder={`비밀번호`}
      />
      <InputErrorMessage className="mb-2" errors={state.errors?.oldPassword} />
      <div className="flex gap-2 pl-2 mb-4">
        <input
          type="checkbox"
          id="changePassword"
          name="changePassword"
          checked={changePassword}
          className="cursor-pointer peer/change-password"
          onChange={() => setChangePassword((prev) => !prev)}
        />
        <label
          htmlFor="changePassword"
          className="font-semibold text-base text-gray-500 peer-checked/change-password:text-primary-500 cursor-pointer"
        >
          비밀번호 변경
        </label>
      </div>
      <Input
        id="newPassword"
        name="newPassword"
        type="password"
        error={state.errors?.newPassword}
        disabled={!changePassword}
        className={`p-4 mb-2`}
        placeholder={`새로운 비밀번호`}
      />
      <InputErrorMessage className="mb-2" errors={state.errors?.newPassword} />
      <Input
        id="confirmNewPassword"
        name="confirmNewPassword"
        type="password"
        error={state.errors?.confirmNewPassword}
        disabled={!changePassword}
        className={`p-4 mb-2`}
        placeholder={`새로운 비밀번호 재입력`}
      />
      <InputErrorMessage className="mb-2" errors={state.errors?.confirmNewPassword} />
      <Button className="mt-4" variant="primary">
        수정 완료
      </Button>
      <Button
        type="button"
        onClick={() => router.back()}
        variant="outline"
        className="mt-2"
        aria-label="Go back"
        role="link"
      >
        돌아가기
      </Button>
      <DeleteConfirmModal
        open={openDeleteProfileModal}
        title={'정말로 프로필 이미지를 삭제하시겠습니까?'}
        description=""
        onClose={() => setOpenDeleteProfileModal(false)}
        onConfirm={handleDeleteProfileImage}
      />
    </form>
  );
}