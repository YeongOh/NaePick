'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { IoLogoYoutube } from 'react-icons/io';
import Spinner from '@/app/components/ui/spinner';
import { extractYoutubeId } from '@/app/lib/videos/youtube';
import { crawlChzzkThumbnailURL } from '@/app/lib/videos/chzzk';
import { downloadImgurUploadS3 } from '@/app/lib/videos/imgur';
import { deleteCandidateObject, updateCandidateAction } from '../actions';

interface Props {
  originalPath: string;
  worldcupId: string;
  candidateId: string;
  mediaType: string;
  onChangeVideoInputIndex: (index: number | null) => void;
  candidateIndex: number;
  showVideoURLInput: boolean;
}

interface UpdateVideoParams {
  originalPath: string;
  worldcupId: string;
  candidateId: string;
  mediaType: string;
}

export default function EditVideoButton({
  originalPath,
  worldcupId,
  candidateId,
  mediaType,
  onChangeVideoInputIndex,
  candidateIndex,
  showVideoURLInput,
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videoURL, setVideoURL] = useState<string>('');
  const [showYoutubeTimeInput, setShowYoutubeTimeInput] = useState(false);
  const [youtubeStartTime, setShowYoutubeStartTime] = useState(0);
  const [youtubeEndTime, setShowYoutubeEndTime] = useState(0);

  const handleYouTube = (text: string) => {
    if (
      text.startsWith('https://youtube.com') ||
      text.startsWith('https://youtu.be') ||
      text.startsWith('https://www.youtube.com') ||
      text.startsWith('https://www.youtu.be')
    ) {
      setShowYoutubeTimeInput(true);
    } else {
      setShowYoutubeTimeInput(false);
    }
  };

  const handleUpdateVideo = async ({
    originalPath,
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
        await updateCandidateAction({
          mediaType: 'cdn_video',
          path: candidateURL,
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
        const youtubeVideoIdWithLoop =
          youtubeStartTime === 0 && youtubeEndTime === 0
            ? null
            : youtubeVideoId + `?s=${youtubeStartTime}&e=${youtubeEndTime}`;

        await updateCandidateAction({
          mediaType: 'youtube',
          path: youtubeVideoIdWithLoop || youtubeVideoId,
          candidateId,
          worldcupId,
        });
        setShowYoutubeTimeInput(false);
        setShowYoutubeStartTime(0);
        setShowYoutubeEndTime(0);
      } else if (
        cleanURL.startsWith('https://chzzk.naver.com/clips') ||
        cleanURL.startsWith('https://chzzk.naver.com/embed/clip')
      ) {
        const chzzkIdIndex = cleanURL.lastIndexOf('/') + 1;
        const chzzkId = cleanURL.slice(chzzkIdIndex);
        const data = await crawlChzzkThumbnailURL(chzzkId);

        await updateCandidateAction({
          mediaType: 'chzzk',
          path: chzzkId,
          thumbnailUrl: data?.chzzkThumbnailURL || '',
          candidateId,
          worldcupId,
        });
      } else {
        throw new Error('주소가 올바른지 확인해 주세요!');
      }
      if (mediaType === 'cdn_img' || mediaType === 'cdn_video')
        await deleteCandidateObject(originalPath, worldcupId, mediaType);

      setVideoURL('');
      onChangeVideoInputIndex(null);
    } catch (error) {
      console.error(error);
      toast.error('잘못된 URL입니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="px-4 py-2 relative bg-white border rounded-md text-base text-primary-500 hover:bg-gray-100 transition-colors"
        onClick={() => onChangeVideoInputIndex(candidateIndex)}
      >
        {isLoading ? (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <Spinner />
          </div>
        ) : null}
        동영상 수정
      </button>
      {showVideoURLInput && !isLoading ? (
        <>
          <div className="cursor-pointer border rounded-md text-base bg-gray-50 p-2 flex items-center absolute right-28 bottom-0 translate-x-1/3 w-[500px] z-40">
            <input
              className="block w-[75%] rounded-md border border-gray-200 py-1 pl-2 placeholder:text-gray-500 focus:outline-primary-500"
              id="videoURL"
              name="videoURL"
              type="url"
              placeholder="https://(주소입력)"
              value={videoURL}
              onChange={(e) => {
                setVideoURL(e.target.value);
                handleYouTube(e.target.value);
              }}
              autoComplete="off"
            />
            <div className="absolute flex items-center gap-1 right-2">
              <button
                type="button"
                onClick={() => onChangeVideoInputIndex(null)}
                className="px-3 py-1 right-[40px] text-gray-500 border bg-white rounded hover:bg-gray-100 transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() =>
                  handleUpdateVideo({
                    originalPath,
                    worldcupId,
                    candidateId,
                    mediaType,
                  })
                }
                className="px-3 py-1 bg-primary-500 text-white right-2 rounded hover:bg-primary-600 active:bg-primary-700 transition-colors"
              >
                입력
              </button>
            </div>
          </div>
          {showYoutubeTimeInput && (
            <div className="absolute text-base text-slate-700 mb-2 z-50 w-96 right-0">
              <div className="bg-gray-100 border rounded w-full">
                <div className="font-semibold p-2 text-center">유튜브 구간 반복 설정</div>
                <div className="flex items-center gap-1 mb-2 justify-center">
                  <IoLogoYoutube color="red" size={'1.2rem'} />
                  <label htmlFor="youtubeStartTime" className="text-gray-500">
                    시작 시간 (초) :{' '}
                  </label>
                  <input
                    className="block w-14 py-1 px-2 text-base text-slate-700 text-right rounded-md border border-gray-200 placeholder:text-gray-500 focus:outline-primary-500"
                    id="youtubeStartTime"
                    type="number"
                    value={youtubeStartTime}
                    onChange={(e) => setShowYoutubeStartTime(Number(e.target.value))}
                    min={0}
                    placeholder="0"
                  />
                  <div className="text-gray-500">종료 시간 (초) : </div>
                  <input
                    className="block w-14 py-1 px-2 text-base text-slate-700 text-right rounded-md border border-gray-200 placeholder:text-gray-500 focus:outline-primary-500"
                    id="youtubeEndTime"
                    type="number"
                    value={youtubeEndTime}
                    onChange={(e) => setShowYoutubeEndTime(Number(e.target.value))}
                    placeholder="0"
                    min={0}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      ) : null}
    </>
  );
}
