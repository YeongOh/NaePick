'use client';

import { Dispatch, SetStateAction, useCallback } from 'react';
import { ImageUp, Info } from 'lucide-react';
import { FileRejection, FileWithPath, useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { CANDIDATE_NAME_MAX_LENGTH } from '@/app/constants';
import { excludeFileExtension } from '@/app/utils';
import { createCandidateAction, getSignedUrlForCandidateImage } from '../actions';

interface Props {
  worldcupId: string;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export default function UploadImageZone({ worldcupId, isLoading, setIsLoading }: Props) {
  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      const imageUploadPromises: Promise<void>[] = [];

      if (isLoading) {
        toast.error('이미지 업로드 처리 중입니다.');
        return;
      }
      setIsLoading(true);
      acceptedFiles.forEach(async (acceptedFile) => {
        imageUploadPromises.push(uploadImage(acceptedFile, worldcupId));
      });

      try {
        const results = await Promise.allSettled(imageUploadPromises);
      } catch (error) {
        console.error(error);
        toast.error('오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }

      async function uploadImage(file: FileWithPath, worldcupId: string) {
        const filenameWithoutExtension = excludeFileExtension(file.name);
        if (filenameWithoutExtension.length > CANDIDATE_NAME_MAX_LENGTH) {
          toast.error(`파일 이름은 ${CANDIDATE_NAME_MAX_LENGTH}자 이하여야 합니다.`);
          return;
        }

        const result = await getSignedUrlForCandidateImage(worldcupId, file.type, file.path as string);
        const { url, path } = result;
        if (!url) throw new Error('서버 에러');

        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });
        if (!response.ok) {
          throw new Error('업로드 실패');
        }
        await createCandidateAction({
          name: filenameWithoutExtension,
          mediaType: 'cdn_img',
          worldcupId,
          path,
        });
      }
    },
    [isLoading, worldcupId, setIsLoading],
  );

  const onError = (error: Error) => {
    toast.error('오류가 발생했습니다.');
  };

  const onDropRejected = useCallback((rejectedFiles: FileRejection[]) => {
    toast.error('지원하지 않는 파일 형식이거나 파일 크기 제한을 초과했습니다.');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxSize: 10485760,
    maxFiles: 10,
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
    onError,
  });

  return (
    <>
      <h2 className="mb-2 text-base font-semibold text-slate-700">후보 이미지 추가</h2>
      <div
        className="relative mb-4 cursor-pointer rounded-md border bg-white p-4 text-base transition-colors hover:bg-gray-50"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="flex items-center justify-center gap-2">
          <ImageUp color="#6d6d6d" size="1.2rem" />
          <p className="text-slate-700">이미지 파일을 드롭하거나 클릭해서 업로드</p>
        </div>
      </div>
      <div className="mb-6 text-base text-slate-500">
        <h2 className="mb-2 flex items-center gap-1 font-semibold text-slate-500">
          <Info size={'1rem'} />
          이미지 업로드 안내
        </h2>
        <p className="ml-2">- 파일 크기 제한은 1MB입니다.</p>
        <p className="ml-2">- 한 번에 업로드할 수 있는 파일 개수는 10개입니다.</p>
      </div>
    </>
  );
}
