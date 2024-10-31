'use client';

import { updateCandidateVideoURL } from '@/app/lib/actions/candidates/update';
import { crawlChzzkThumbnailURL } from '@/app/lib/actions/videos/chzzk';
import { downloadImgurUploadS3 } from '@/app/lib/actions/videos/imgur';
import { extractYoutubeId } from '@/app/lib/actions/videos/youtube';
import { MediaType } from '@/app/lib/definitions';
import { deleteCandidateObject } from '@/app/lib/bucket';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Spinner from '../ui/spinner';

interface Props {
  originalPathname: string;
  worldcupId: string;
  candidateId: string;
  mediaType: MediaType;
  onChangeVideoInputIndex: (index: number | null) => void;
  candidateIndex: number;
  showVideoURLInput: boolean;
}

interface UpdateVideoParams {
  originalPathname: string;
  worldcupId: string;
  candidateId: string;
  mediaType: MediaType;
}

export default function UpdateWorldcupCandidateVideo({
  originalPathname,
  worldcupId,
  candidateId,
  mediaType,
  onChangeVideoInputIndex,
  candidateIndex,
  showVideoURLInput,
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videoURL, setVideoURL] = useState<string>('');

  const handleUpdateVideo = async ({
    originalPathname,
    worldcupId,
    candidateId,
    mediaType,
  }: UpdateVideoParams) => {
    try {
      if (isLoading) {
        toast.error('동영상을 수정 중입니다.');
        return;
      }
      const UrlObject = new URL(videoURL);
      if (UrlObject.protocol != 'https:') {
        toast.error('https로 시작하는 주소를 입력해 주세요.');
        return;
      }

      const hostname = UrlObject.hostname;
      const cleanURL = UrlObject.toString();

      setIsLoading(true);
      if (hostname === 'imgur.com' || hostname === 'www.imgur.com') {
        const candidateURL = await downloadImgurUploadS3(cleanURL, worldcupId);
        await updateCandidateVideoURL({
          mediaType: 'cdn_video',
          candidatePathname: candidateURL,
          candidateId,
          worldcupId,
        });
      } else if (
        hostname === 'youtube.com' ||
        hostname === 'youtu.be' ||
        hostname === 'www.youtube.com' ||
        hostname === 'www.youtu.be'
      ) {
        const youtubeVideoId = extractYoutubeId(cleanURL);
        if (youtubeVideoId === null) {
          throw new Error('유튜브 주소가 올바른지 확인 해주세요.');
        }

        await updateCandidateVideoURL({
          mediaType: 'youtube',
          candidatePathname: youtubeVideoId,
          candidateId,
          worldcupId,
        });
      } else if (
        cleanURL.startsWith('https://chzzk.naver.com/clips') ||
        cleanURL.startsWith('https://chzzk.naver.com/embed/clip')
      ) {
        const chzzkIdIndex = cleanURL.lastIndexOf('/') + 1;
        const chzzkId = cleanURL.slice(chzzkIdIndex);
        const data = await crawlChzzkThumbnailURL(chzzkId);

        await updateCandidateVideoURL({
          mediaType: 'chzzk',
          candidatePathname: chzzkId,
          thumbnailURL: data?.chzzkThumbnailURL || '',
          candidateId,
          worldcupId,
        });
      } else {
        throw new Error('주소가 올바른지 확인해 주세요!');
      }
      if (mediaType === 'cdn_img' || mediaType === 'cdn_video') {
        await deleteCandidateObject(originalPathname, worldcupId, mediaType);
      }
      setVideoURL('');
      onChangeVideoInputIndex(null);
    } catch (error) {
      toast.error('잘못된 URL입니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type='button'
        className='px-4 py-2 relative bg-white border rounded-md text-base text-primary-500 hover:bg-gray-100 transition-colors'
        onClick={() => onChangeVideoInputIndex(candidateIndex)}
      >
        {isLoading ? (
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50'>
            <Spinner />
          </div>
        ) : null}
        동영상 수정
      </button>
      {showVideoURLInput && !isLoading ? (
        <div className='cursor-pointer border rounded-md text-base bg-gray-50 p-2 flex items-center absolute right-28 bottom-0 translate-x-1/3 w-[500px]'>
          <input
            className='block w-[75%] rounded-md border border-gray-200 py-1 pl-2 placeholder:text-gray-500 focus:outline-primary-500'
            id='videoURL'
            name='videoURL'
            type='url'
            placeholder='https://(주소입력)'
            value={videoURL}
            onChange={(e) => setVideoURL(e.target.value)}
            autoComplete='off'
          />
          <div className='absolute flex items-center gap-1 right-2'>
            <button
              type='button'
              onClick={() => onChangeVideoInputIndex(null)}
              className='px-3 py-1 right-[40px] text-gray-500 border bg-white rounded hover:bg-gray-100 transition-colors'
            >
              취소
            </button>
            <button
              type='button'
              onClick={() =>
                handleUpdateVideo({
                  originalPathname,
                  worldcupId,
                  candidateId,
                  mediaType,
                })
              }
              className='px-3 py-1 bg-primary-500 text-white right-2 rounded hover:bg-primary-700 transition-colors'
            >
              입력
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
