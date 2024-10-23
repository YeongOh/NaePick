'use client';

import { updateCandidateImageURL } from '@/app/lib/actions/candidates/update';
import {
  deleteCandidateObject,
  fetchUpdateCandidateImageUploadURL,
} from '@/app/lib/images';
import { useCallback } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    // accept: {
    //   'image/png': ['.png'],
    //   'image/jpeg': ['.jpeg'],
    //   'image/jpg': ['.jpg'],
    // },
    onDrop,
    multiple: false,
  });
  return (
    <button
      type='button'
      className='px-4 py-2 bg-white border rounded-md text-base text-primary-500'
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <div>이미지 수정</div>
    </button>
  );
}
