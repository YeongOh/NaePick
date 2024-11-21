/* eslint-disable @next/next/no-img-element */
'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { IoLogoYoutube } from 'react-icons/io';
import { SiImgur } from 'react-icons/si';
import { CHZZK_THUMBNAIL_URL } from '@/app/constants';
import { crawlChzzkThumbnailURL } from '@/app/lib/videos/chzzk';
import { downloadImgurUploadS3 } from '@/app/lib/videos/imgur';
import { extractYoutubeId, fetchYoutubeTitle } from '@/app/lib/videos/youtube';
import Button from '@/app/ui/Button';
import { createCandidateAction } from '../actions';

interface Props {
  worldcupId: string;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export default function UploadLinkZone({ worldcupId, isLoading, setIsLoading }: Props) {
  const [showYoutubeTimeInput, setShowYoutubeTimeInput] = useState(false);
  const [youtubeStartTime, setShowYoutubeStartTime] = useState(0);
  const [youtubeEndTime, setShowYoutubeEndTime] = useState(0);
  const [videoURL, setVideoURL] = useState<string>('');

  const handleYouTube = (text: string) => {
    const trimText = text.trim();
    if (
      trimText.startsWith('https://youtube.com') ||
      trimText.startsWith('https://youtu.be') ||
      trimText.startsWith('https://www.youtube.com') ||
      trimText.startsWith('https://www.youtu.be')
    ) {
      setShowYoutubeTimeInput(true);
    } else {
      setShowYoutubeTimeInput(false);
    }
  };

  const handleVideoUpload = async () => {
    try {
      if (isLoading) {
        toast.error('동영상을 업로드 처리 중입니다.');
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
        const videoPath = await downloadImgurUploadS3(cleanURL, worldcupId);
        await createCandidateAction({
          mediaType: 'cdn_video',
          name: cleanURL,
          path: videoPath,
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
          throw new Error('유튜브 주소가 올바른지 확인해 주세요.');
        }
        const youtubeVideoURL = `https://www.youtube.com/watch?v=${youtubeVideoId}`;
        const youtubeVideoTitle = await fetchYoutubeTitle(youtubeVideoURL);
        const youtubeVideoIdWithLoop =
          youtubeStartTime === 0 && youtubeEndTime === 0
            ? null
            : youtubeVideoId + `?s=${youtubeStartTime}&e=${youtubeEndTime}`;

        await createCandidateAction({
          name: youtubeVideoTitle ?? '유튜브 동영상',
          path: youtubeVideoIdWithLoop || youtubeVideoId,
          mediaType: 'youtube',
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

        await createCandidateAction({
          name: data?.chzzkClipTitle || '치지직 클립',
          thumbnailUrl: data?.chzzkThumbnailURL || '',
          path: chzzkId,
          mediaType: 'chzzk',
          worldcupId,
        });
      } else {
        throw new Error('주소가 올바른지 확인해 주세요.');
      }
      setVideoURL('');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('예상치 못한 오류로 인해 업로드를 할 수 없었습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="mb-2 text-base font-semibold text-slate-700">후보 링크 업로드</h2>
      <div className="relative mb-4 flex cursor-pointer items-center rounded-md border bg-gray-100 p-2 text-base">
        <input
          id="videoURL"
          className="block w-[91%] rounded-md border border-gray-200 p-2 placeholder:text-gray-500 focus:outline-primary-500"
          type="url"
          placeholder="https://(주소입력)"
          value={videoURL}
          onChange={(e) => {
            setVideoURL(e.target.value);
            handleYouTube(e.target.value);
          }}
          autoComplete="off"
        />
        <Button
          type="button"
          className="absolute right-2"
          variant="primary"
          size="sm"
          onClick={handleVideoUpload}
        >
          추가
        </Button>
      </div>
      {showYoutubeTimeInput && (
        <div className="mb-2 text-base text-slate-700">
          <div>
            <div className="mb-2 font-semibold">유튜브 구간 반복 설정</div>
            <div className="flex items-center justify-center gap-1 rounded border bg-gray-100 p-2">
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
      <div className="mb-6 text-base text-slate-500">
        <h2 className="mb-2 flex items-center gap-1 font-semibold text-slate-500">
          <Info size={'1rem'} />
          링크 업로드 안내
        </h2>
        <ul className="pl-2">
          <li className="flex items-center gap-1">
            <SiImgur color="green" size={'1.2rem'} /> Imgur: https://imgur.com/i6uyHNs
          </li>
          <li className="flex items-center gap-1">
            <IoLogoYoutube color="red" size={'1.2rem'} />
            YouTube: https://youtube.com/watch?v=LV3vxkZpUjk
          </li>
          <li className="flex items-center gap-1">
            <img src={CHZZK_THUMBNAIL_URL} width={20} height={20} alt={'CHZZK logo'} />
            치지직: https://chzzk.naver.com/clips/v5xjPHhLjc
          </li>
          <li className="">- Imgur, 치지직 썸네일 생성 시간: 약 3~5초</li>
          <li className="">- Imgur mp4 파일 용량 제한: 2MB</li>
          <li className="">- 유튜브 주소를 입력할 시 시작 및 종료 시간을 입력하는 설정이 팝업됩니다.</li>
        </ul>
      </div>
    </>
  );
}
