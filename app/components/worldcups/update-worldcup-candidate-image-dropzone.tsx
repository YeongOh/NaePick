'use client';

import { updateCandidateImageURL } from '@/app/lib/actions/candidates/update';
import {
  deleteCandidateObject,
  fetchUpdateCandidateImageUploadURL,
} from '@/app/lib/images';
import { useCallback } from 'react';
import { FileRejection, FileWithPath, useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

interface Props {
  worldcupId: string;
  candidateId: string;
  originalCandidateURL: string;
}

export default function UpdateWorldcupCandidateImageDropzone({
  worldcupId,
  originalCandidateURL,
  candidateId,
}: Props) {
  const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
    try {
      const file = acceptedFiles[0];
      const { signedURL, candidateURL } =
        await fetchUpdateCandidateImageUploadURL(
          worldcupId,
          candidateId,
          file.path as string,
          file.type
        );
      const response = await fetch(signedURL, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      console.log(response);
      if (response.ok) {
        toast.success('이미지를 수정했습니다!');

        if (candidateURL !== originalCandidateURL) {
          // 전의 이미지 파일과 파일타입이 달라서 키가 바뀐다면 고아 이미지가 발생하기에
          // 삭제하고 다시 업로드
          await deleteCandidateObject(originalCandidateURL, worldcupId);
          // revalidatePath
          await updateCandidateImageURL(worldcupId, candidateId, candidateURL);
        }
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDropRejected = useCallback((rejectedFiles: FileRejection[]) => {
    // 최대 파일 개수 제한 오류 출력
    // 최대 파일 사이즈 제한 오류 출력
    // 지원하지 않는 파일 사이즈 제한 오류 출력
    toast.error('지원하지 않는 파일 형식이거나 파일 크기 제한을 넘었습니다.');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxSize: 10485760,
    accept: {
      'image/png': [], // 'gif' 아직 미지원
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
    <button
      type='button'
      className='px-4 py-2 bg-white border rounded-md text-base text-primary-500'
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <span>이미지 수정</span>
    </button>
  );
}
