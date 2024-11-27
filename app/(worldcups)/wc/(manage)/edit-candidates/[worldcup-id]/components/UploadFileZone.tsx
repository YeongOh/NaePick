'use client';

import { Dispatch, SetStateAction, useCallback } from 'react';
import { extname } from 'path';
import { Info, Upload } from 'lucide-react';
import { FileRejection, FileWithPath, useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { CANDIDATE_NAME_MAX_LENGTH } from '@/app/constants';
import { excludeFileExtension } from '@/app/utils';
import {
  createCandidateAction,
  getSignedUrlForCandidateImage,
  getSignedUrlForCandidateVideo,
} from '../actions';

interface Props {
  worldcupId: string;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export default function UploadFileZone({ worldcupId, isLoading, setIsLoading }: Props) {
  const MAX_FILE_LENGTH = 10;

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      if (isLoading) {
        toast.error('파일 업로드 처리 중입니다.');
        return;
      }
      setIsLoading(true);

      try {
        const imageUploadPromises = acceptedFiles.map(async (acceptedFile) => {
          uploadImage(acceptedFile, worldcupId);
        });
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

        const extension = extname(file.name);
        let result;
        let mediaType;
        if (extension === '.mp4') {
          result = await getSignedUrlForCandidateVideo(worldcupId, file.type, file.path as string);
          mediaType = 'cdn_video';
        } else {
          result = await getSignedUrlForCandidateImage(worldcupId, file.type, file.path as string);
          mediaType = 'cdn_img';
        }
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
          mediaType,
          worldcupId,
          path,
        });
      }
    },
    [isLoading, worldcupId, setIsLoading],
  );

  const onDropRejected = useCallback((rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length > MAX_FILE_LENGTH) {
      toast.error(`한번에 업로드할 수 있는 파일은 최대 ${MAX_FILE_LENGTH}개 입니다.`);
      return;
    }
    rejectedFiles.forEach((rejectedFile) => {
      if (rejectedFile.errors[0].code === 'file-invalid-type') {
        toast.error(`${rejectedFile.file.name}\n지원되지 않는 파일 형식입니다.`);
      } else if (rejectedFile.errors[0].code === 'file-too-large') {
        toast.error(`${rejectedFile.file.name}\n파일의 용량은 최대 2MB까지 가능합니다.`);
      } else {
        toast.error(`${rejectedFile.file.name}\n파일을 업로드하지 못했습니다.`);
      }
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    maxSize: 2097152, // 2MB
    maxFiles: MAX_FILE_LENGTH,
    accept: {
      'image/png': [],
      'image/jpg': [],
      'image/jpeg': [],
      'image/webp': [],
      'video/mp4': [],
    },
    onDrop,
    onDropRejected,
  });

  return (
    <>
      <h2 className="mb-2 text-base font-semibold text-slate-700">후보 파일 업로드</h2>
      <div
        className="relative mb-4 cursor-pointer rounded-md border bg-white p-4 text-base transition-colors hover:bg-gray-50"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="flex items-center justify-center gap-2 text-slate-700">
          <Upload size="1.2rem" />
          <p>파일을 드롭하거나 클릭하여 업로드하세요.</p>
        </div>
      </div>
      <div className="mb-6 text-base text-slate-500">
        <h2 className="mb-2 flex items-center gap-1 font-semibold text-slate-500">
          <Info size={'1rem'} />
          파일 업로드 안내
        </h2>
        <p className="ml-2">- 지원되는 파일 형식: JPG, JPEG, WEBP, PNG, MP4</p>
        <p className="ml-2">- 파일 크기 제한: 2MB</p>
        <p className="ml-2">- 한 번에 업로드할 수 있는 파일 개수: 최대 10개</p>
        <p className="ml-2">- MP4 파일의 썸네일 생성 시간: 약 3~5초 (새로고침 필요) </p>
      </div>
    </>
  );
}
