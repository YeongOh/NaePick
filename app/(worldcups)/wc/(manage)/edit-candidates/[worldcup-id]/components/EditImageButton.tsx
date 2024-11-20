'use client';

import { useCallback, useState } from 'react';
import { FileRejection, FileWithPath, useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import Button from '@/app/ui/Button';
import Spinner from '@/app/ui/Spinner';
import { deleteCandidateObject, getSignedUrlForCandidateImage } from '../actions';
import { updateCandidateAction } from '../actions';

interface Props {
  originalPath: string;
  worldcupId: string;
  candidateId: string;
  mediaType: string;
}

export default function EditImageButton({ originalPath, worldcupId, candidateId, mediaType }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      try {
        if (isLoading) {
          toast.error('이미지를 수정 중입니다.');
          return;
        }
        setIsLoading(true);
        const file = acceptedFiles[0];
        const result = await getSignedUrlForCandidateImage(worldcupId, file.type, file.path as string);
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

        if (mediaType === 'cdn_img' || mediaType === 'cdn_video')
          await deleteCandidateObject(originalPath, worldcupId, mediaType);

        await updateCandidateAction({ worldcupId, candidateId, path, mediaType: 'cdn_img' });
        toast.success('이미지를 수정했습니다!');
      } catch (error) {
        toast.error('오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    },
    [candidateId, isLoading, mediaType, originalPath, worldcupId],
  );

  const onDropRejected = useCallback((rejectedFiles: FileRejection[]) => {
    toast.error('지원하지 않는 파일 형식이거나 파일 크기 제한을 초과했습니다.');
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
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
    noDrag: true,
  });

  return (
    <div {...getRootProps()}>
      <Button type="button" size="sm" variant="outline">
        <input {...getInputProps()} />
        {isLoading ? (
          <div className="absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
            <Spinner />
          </div>
        ) : null}
        이미지 수정
      </Button>
    </div>
  );
}
