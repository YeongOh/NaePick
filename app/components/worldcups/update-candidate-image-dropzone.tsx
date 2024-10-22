'use client';

import { updateCandidateImageURL } from '@/app/lib/actions/candidates/update';
import {
  deleteObject,
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

export default function UpdateCandidateImageDropzone({
  worldcupId,
  originalCandidateURL,
  candidateId,
}: Props) {
  const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
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
        // 후속 작업이 없어 기다릴 필요 없으니 await 생략
        deleteObject(originalCandidateURL);
        // revalidatePath때문에 후속작업 필요
        await updateCandidateImageURL(worldcupId, candidateId, candidateURL);
      }
    }
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
    <div className='cursor-pointer' {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag drop some files here, or click to select files</p>
      )}
    </div>
  );
}
