'use client';

import { useCallback, useState } from 'react';
import { extname } from 'path';
import { Upload } from 'lucide-react';
import { FileRejection, FileWithPath, useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import Button from '@/app/ui/Button';
import Spinner from '@/app/ui/Spinner';
import {
  deleteCandidateObject,
  getSignedUrlForCandidateImage,
  getSignedUrlForCandidateVideo,
} from '../actions';
import { updateCandidateAction } from '../actions';

interface Props {
  originalPath: string;
  worldcupId: string;
  candidateId: string;
  mediaType: string;
}

export default function EditFileButton({ originalPath, worldcupId, candidateId, mediaType }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        if (isLoading) {
          toast.error('파일을 수정 중입니다.');
          return;
        }
        setIsLoading(true);

        const extension = extname(file.name);
        let result;
        let newMdiaType;
        if (extension === '.mp4') {
          result = await getSignedUrlForCandidateVideo(worldcupId, file.type, file.path as string);
          newMdiaType = 'cdn_video';
        } else {
          result = await getSignedUrlForCandidateImage(worldcupId, file.type, file.path as string);
          newMdiaType = 'cdn_img';
        }
        if (!result?.url) throw new Error('서버 에러');

        const { url, path } = result;
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });
        if (!response.ok) throw new Error('업로드 실패');

        await updateCandidateAction({ worldcupId, candidateId, path, mediaType: newMdiaType });

        if (mediaType === 'cdn_img' || mediaType === 'cdn_video')
          await deleteCandidateObject(originalPath, worldcupId, mediaType);

        toast.success('파일을 수정했습니다!');
      } catch (error) {
        toast.error('오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    },
    [candidateId, isLoading, mediaType, originalPath, worldcupId],
  );

  const onDropRejected = useCallback((rejectedFiles: FileRejection[]) => {
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
    multiple: false,
    accept: {
      'image/png': [],
      'image/jpg': [],
      'image/jpeg': [],
      'image/webp': [],
      'video/mp4': [],
    },
    onDrop,
    onDropRejected,
    noDrag: true,
  });

  return (
    <div {...getRootProps()}>
      <Button type="button" size="sm" variant="outline" aria-label="파일 업로드">
        <input {...getInputProps()} />
        {isLoading ? (
          <div className="absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
            <Spinner />
          </div>
        ) : null}
        <div className="sm:hidden">
          <Upload size="1.2rem" />
        </div>
        <div className="hidden sm:block">파일 업로드</div>
      </Button>
    </div>
  );
}
