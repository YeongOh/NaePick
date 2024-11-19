'use client';

import { useCallback, useState } from 'react';

import { Info } from 'lucide-react';
import { FileRejection, FileWithPath, useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

import DeleteConfirmModal from '@/app/components/Modal/DeleteConfirmModal';
import NewAvatar from '@/app/ui/Avatar';

import { deleteProfileImage, getSignedUrlForProfileImage, updateUserProfilePathAction } from '../actions';

interface Props {
  profilePath: string | null;
  userId: string;
}

export default function EditAvatar({ userId, profilePath }: Props) {
  const [openDeleteProfileModal, setOpenDeleteProfileModal] = useState(false);

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

  return (
    <>
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
      <DeleteConfirmModal
        open={openDeleteProfileModal}
        title={'프로필 이미지를 삭제하시겠습니까?'}
        description=""
        onClose={() => setOpenDeleteProfileModal(false)}
        onConfirm={handleDeleteProfileImage}
      />
    </>
  );
}
