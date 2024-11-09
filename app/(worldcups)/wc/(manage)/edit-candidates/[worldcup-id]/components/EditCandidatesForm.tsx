/* eslint-disable @next/next/no-img-element */
'use client';

import { CANDIDATE_NAME_MAX_LENGTH, CHZZK_THUMBNAIL_URL, MIN_NUMBER_OF_CANDIDATES } from '@/app/constants';
import {
  createCandidateAction,
  deleteCandidateAction,
  deleteCandidateObject,
  getSignedUrlForCandidateImage,
  updateCandidateNamesAction,
} from '@/app/(worldcups)/wc/(manage)/edit-candidates/[worldcup-id]/actions';
import { excludeFileExtension } from '@/app/utils';
import { useCallback, useState } from 'react';
import { useDropzone, FileWithPath, FileRejection } from 'react-dropzone';
import toast from 'react-hot-toast';
import EditVideoButton from './EditVideoButton';
import { IoLogoYoutube } from 'react-icons/io';
import { SiImgur } from 'react-icons/si';
import { ImageUp, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Spinner from '@/app/components/ui/spinner';
import ThumbnailImage from '@/app/components/ThumbnailImage';
import EditImageButton from './EditImageButton';
import Media from '@/app/components/media';
import Pagination from '@/app/components/pagination';
import Button from '@/app/components/ui/button';
import LinkButton from '@/app/components/ui/link-button';
import DeleteConfirmModal from '@/app/components/modal/delete-confirm-modal';
import { downloadImgurUploadS3 } from '@/app/lib/videos/imgur';
import { extractYoutubeId, fetchYoutubeTitle } from '@/app/lib/videos/youtube';
import { crawlChzzkThumbnailURL } from '@/app/lib/videos/chzzk';

interface Candidate {
  id: string;
  name: string;
  path: string;
  thumbnailUrl: string | null;
  mediaType: string;
  createdAt: string;
}

interface Props {
  worldcupId: string;
  candidates: Candidate[];
  page: number;
  count: number;
}

export default function EditCandidatesForm({ worldcupId, candidates, page, count }: Props) {
  const [candidateToDelete, setSelectedCandidateToDelete] = useState<Candidate | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const [selectedCandidateToPreviewIndex, setSelectedCandidateToPreviewIndex] = useState<number | null>(null);
  const [showUpdateVideoInputIndex, setShowVideoInputIndex] = useState<number | null>(null);
  const [showYoutubeTimeInput, setShowYoutubeTimeInput] = useState(false);
  const [youtubeStartTime, setShowYoutubeStartTime] = useState(0);
  const [youtubeEndTime, setShowYoutubeEndTime] = useState(0);
  const [videoURL, setVideoURL] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const totalPages = Math.ceil((count || 0) / 10);

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
        const hasErrors = results.some((result) => result.status === 'rejected');

        if (hasErrors) toast.error('일부 이미지 업로드에 실패했습니다.');
        else toast.success('이미지 업로드에 성공했습니다!');
      } catch (error) {
        console.error(error);
        toast.error('오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }

      async function uploadImage(file: FileWithPath, worldcupId: string) {
        const filenameWithoutExtension = excludeFileExtension(file.name);
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
    [isLoading, worldcupId]
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

  const handleUpdateWorldcupCandidates = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      await updateCandidateNamesAction(worldcupId, formData);
      toast.success('저장 되었습니다.');
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleDeleteCandidateConfirm = async () => {
    try {
      if (!candidateToDelete) throw new Error('선택된 후보가 없습니다.');

      if (candidateToDelete.mediaType === 'cdn_img' || candidateToDelete.mediaType === 'cdn_video')
        await deleteCandidateObject(candidateToDelete.path, worldcupId, candidateToDelete.mediaType);

      await deleteCandidateAction(candidateToDelete.id, worldcupId);
      toast.success('삭제에 성공했습니다.');
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setShowDeleteConfirmModal(false);
    }
  };

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
      toast.error('잘못된 URL입니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageNumberOnClick = async (page: number) => {
    router.push(`/wc/edit-candidates/${worldcupId}?page=${page}`, {
      scroll: false,
    });
  };

  const handleOnChangeUpdateVideoInputIndex = (index: number | null) => {
    setShowVideoInputIndex(index);
  };
  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  return (
    <>
      <form
        onSubmit={handleUpdateWorldcupCandidates}
        className="rounded-md bg-gray-50 p-6 mb-20"
        onKeyDown={handleFormKeyDown}
      >
        <h2 className="font-semibold text-slate-700 mb-2 text-base">후보 이미지 추가</h2>
        <div
          className="relative cursor-pointer border rounded-md mb-4 text-base bg-white p-4 hover:bg-gray-50 transition-colors"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <div className="flex items-center justify-center gap-2">
            <ImageUp color="#6d6d6d" size="1.2rem" />
            <p className="text-slate-700">이미지 파일을 드롭하거나 클릭해서 업로드</p>
          </div>
        </div>
        <div className="text-base mb-6 text-slate-500">
          <h2 className="font-semibold text-slate-500 mb-2 flex items-center gap-1">
            <Info size={'1rem'} />
            이미지 업로드 안내
          </h2>
          <p className="ml-2">- 파일 크기 제한은 1MB입니다.</p>
          <p className="ml-2">- 한 번에 업로드할 수 있는 파일 개수는 10개입니다.</p>
        </div>
        <h2 className="font-semibold text-slate-700 mb-2 text-base">후보 동영상 추가</h2>

        <div className="cursor-pointer border rounded-md text-base bg-gray-100 p-2 flex items-center mb-4 relative">
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
          <button
            type="button"
            onClick={handleVideoUpload}
            className="absolute px-4 py-2 bg-primary-500 text-white right-2 rounded hover:bg-primary-600 active:bg-primary-700 transition-colors font-semibold"
          >
            추가
          </button>
        </div>
        {showYoutubeTimeInput && (
          <div className="text-base text-slate-700 mb-2">
            <div>
              <div className="font-semibold mb-2">유튜브 구간 반복 설정</div>
              <div className="flex items-center gap-1 bg-gray-100 p-2 justify-center border rounded">
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
        <div className="text-base mb-6 text-slate-500">
          <h2 className="font-semibold text-slate-500 mb-2 flex items-center gap-1">
            <Info size={'1rem'} />
            동영상 주소 형식
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
            <li className="">- Imgur와 치지직의 썸네일 생성에는 최소 3~5초가 걸릴 수 있습니다.</li>
            <li className="">- 유튜브 주소를 입력할 시 시작 및 종료 시간을 입력하는 설정이 팝업됩니다.</li>
          </ul>
        </div>
        <h2 className="font-semibold text-slate-700 mb-2 text-base">
          {count === 0 ? '아직 후보가 충분하지 않네요!' : `후보 ${count}명`}
        </h2>
        {count < MIN_NUMBER_OF_CANDIDATES ? (
          <p className="text-base text-gray-500 pl-2 mb-4">
            - {MIN_NUMBER_OF_CANDIDATES - count}명을 더 추가하면 이상형 월드컵을 시작할 수 있습니다.
          </p>
        ) : null}
        {isLoading ? (
          <div className="flex justify-center items-center border rounded bg-gray-100 my-4 h-[64px] w-full animate-pulse">
            <Spinner />
          </div>
        ) : null}
        <ul>
          {candidates.map((candidate, candidateIndex) => (
            <li key={`${candidate.id}/${candidate.path}`}>
              <div className="flex items-center border mb-4 bg-gray-100">
                <div className="relative w-16 h-16 cursor-pointer">
                  <ThumbnailImage
                    path={candidate.path}
                    name={candidate.name}
                    mediaType={candidate.mediaType}
                    thumbnailURL={candidate.thumbnailUrl}
                    onClick={() => {
                      setSelectedCandidateToPreviewIndex(
                        candidateIndex === selectedCandidateToPreviewIndex ? null : candidateIndex
                      );
                    }}
                    size="small"
                  />
                </div>
                <div className="w-full flex">
                  <input
                    className="flex-1 ml-2 mr-1 pl-4 text-base text-slate-700 placeholder:text-gray-500 focus:outline-primary-500  border rounded-md"
                    id={candidate.name}
                    name={candidate.id}
                    type="text"
                    defaultValue={candidate.name}
                    placeholder={candidate.name}
                    autoComplete="off"
                    maxLength={CANDIDATE_NAME_MAX_LENGTH}
                  />
                  <div className="flex items-center gap-1">
                    <div className="relative">
                      <EditVideoButton
                        worldcupId={worldcupId}
                        candidateId={candidate.id}
                        originalPath={candidate.path}
                        mediaType={candidate.mediaType}
                        candidateIndex={candidateIndex}
                        onChangeVideoInputIndex={handleOnChangeUpdateVideoInputIndex}
                        showVideoURLInput={showUpdateVideoInputIndex === candidateIndex}
                      />
                    </div>
                    <EditImageButton
                      worldcupId={worldcupId}
                      candidateId={candidate.id}
                      originalPath={candidate.path}
                      mediaType={candidate.mediaType}
                    />
                    <button
                      type="button"
                      className="text-red-500 px-4 py-2 border rounded-md bg-white text-base mr-2 hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        setSelectedCandidateToDelete(candidate);
                        setShowDeleteConfirmModal(true);
                      }}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
              {selectedCandidateToPreviewIndex === candidateIndex && (
                <div className="w-full flex justify-center my-8 h-[400px] bg-black">
                  <Media path={candidate.path} name={candidate.name} mediaType={candidate.mediaType} />
                </div>
              )}
            </li>
          ))}
        </ul>
        {totalPages > 0 ? (
          <div className="overflow-hidden rounded-bl rounded-br">
            <Pagination
              className="bg-gray-50"
              totalPages={totalPages}
              currentPageNumber={page}
              range={2}
              onPageNumberClick={handlePageNumberOnClick}
            />
          </div>
        ) : null}
        <Button className="mt-8" variant="primary">
          이상형 월드컵 후보 이름 저장
        </Button>
        <div className="flex">
          <LinkButton href={`/wc/${worldcupId}`} className="mt-2" variant="outline">
            이상형 월드컵 확인하기
          </LinkButton>
        </div>
      </form>
      <DeleteConfirmModal
        open={showDeleteConfirmModal}
        onClose={() => {
          setShowDeleteConfirmModal(false);
          setSelectedCandidateToDelete(null);
        }}
        onConfirm={handleDeleteCandidateConfirm}
        title={'해당 후보를 정말로 삭제하시겠습니까?'}
        description={'후보의 데이터가 영구히 삭제되며 복원할 수 없습니다.'}
      />
    </>
  );
}
