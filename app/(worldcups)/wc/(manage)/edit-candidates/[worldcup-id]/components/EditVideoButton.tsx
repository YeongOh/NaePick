'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { IoLogoYoutube } from 'react-icons/io';
import Button from '@/app/components/ui/Button';
import Spinner from '@/app/components/ui/Spinner';
import { crawlChzzkThumbnailURL } from '@/app/lib/videos/chzzk';
import { downloadImgurUploadS3 } from '@/app/lib/videos/imgur';
import { extractYoutubeId } from '@/app/lib/videos/youtube';
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
    <div className="relative">
      <Button
        variant="outline"
        type="button"
        size="sm"
        className="relative"
        onClick={() => onChangeVideoInputIndex(candidateIndex)}
      >
        {isLoading ? (
          <div className="absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
            <Spinner />
          </div>
        ) : null}
        동영상 수정
      </Button>
      {showVideoURLInput && !isLoading ? (
        <>
          <div className="absolute bottom-0 right-28 z-40 flex w-[500px] translate-x-1/3 cursor-pointer items-center rounded-md border bg-gray-50 p-2 text-base">
            <input
              className="block w-[77%] rounded-md border border-gray-200 p-1.5 placeholder:text-gray-500 focus:outline-primary-500"
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
            <div className="absolute right-2 flex items-center gap-1">
              <Button type="button" onClick={() => onChangeVideoInputIndex(null)} variant="outline" size="sm">
                취소
              </Button>
              <Button
                type="button"
                onClick={() =>
                  handleUpdateVideo({
                    originalPath,
                    worldcupId,
                    candidateId,
                    mediaType,
                  })
                }
                variant="primary"
                size="sm"
              >
                추가
              </Button>
            </div>
          </div>
          {showYoutubeTimeInput && (
            <div className="absolute right-0 z-50 mb-2 w-96 text-base text-slate-700">
              <div className="w-full rounded border bg-gray-100">
                <div className="p-2 text-center font-semibold">유튜브 구간 반복 설정</div>
                <div className="mb-2 flex items-center justify-center gap-1">
                  <IoLogoYoutube color="red" size={'1.2rem'} />
                  <label htmlFor="youtubeStartTime" className="text-gray-500">
                    시작 시간 (초) :{' '}
                  </label>
                  <input
                    className="block w-14 rounded-md border border-gray-200 px-2 py-1 text-right text-base text-slate-700 placeholder:text-gray-500 focus:outline-primary-500"
                    id="youtubeStartTime"
                    type="number"
                    value={youtubeStartTime}
                    onChange={(e) => setShowYoutubeStartTime(Number(e.target.value))}
                    min={0}
                    placeholder="0"
                  />
                  <div className="text-gray-500">종료 시간 (초) : </div>
                  <input
                    className="block w-14 rounded-md border border-gray-200 px-2 py-1 text-right text-base text-slate-700 placeholder:text-gray-500 focus:outline-primary-500"
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
    </div>
  );
}
