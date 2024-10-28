'use client';

import { CANDIDATE_NAME_MAX_LENGTH } from '@/app/constants';
import { createCandidate } from '@/app/lib/actions/candidates/create';
import { updateCandidateNames } from '@/app/lib/actions/candidates/update';
import { Candidate, WorldcupCard } from '@/app/lib/definitions';
import {
  deleteCandidateObject,
  fetchCandidateImageUploadURL,
} from '@/app/lib/images';
import { excludeFileExtension } from '@/app/utils/utils';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { useDropzone, FileWithPath, FileRejection } from 'react-dropzone';
import toast from 'react-hot-toast';
import UpdateWorldcupCandidateImageDropzone from './update-worldcup-candidate-image-dropzone';
import { deleteCandidate } from '@/app/lib/actions/candidates/delete';
import { FaFileUpload } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { sortDate } from '@/app/utils/date';
import DeleteConfirmModal from '../modal/delete-confirm-modal';
import { MdInfo } from 'react-icons/md';
import Preview from '../preview/preview';
import { downloadImgurUploadS3 } from '@/app/lib/actions/videos/imgur';
import {
  extractYoutubeId,
  fetchYoutubeTitle,
} from '@/app/lib/actions/videos/youtube';
import { crawlChzzkThumbnailURL } from '@/app/lib/actions/videos/chzzk';
import ResponsiveThumbnailImage from '../thumbnail/responsive-thumbnail-image';
import CardThumbnail from '../card/card-thumbnail';
import UpdateWorldcupCandidateVideo from './update-worldcup-candidate-video';

interface Props {
  worldcup: WorldcupCard;
  candidates: Candidate[];
}

export default function UpdateWorldcupCandidatesForm({
  worldcup,
  candidates,
}: Props) {
  const [selectedCandidateToDelete, setSelectedCandidateToDelete] =
    useState<Candidate | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] =
    useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [selectedCandidateToPreview, setSelectedCandidateToPreview] =
    useState<Candidate | null>(null);
  const [videoURL, setVideoURL] = useState<string>('');
  const worldcupId = worldcup.worldcupId;
  console.log(candidates);

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      acceptedFiles.forEach(async (acceptedFile) => {
        const filenameWithoutExtension = excludeFileExtension(
          acceptedFile.name
        );
        const { signedURL, candidatePathname } =
          await fetchCandidateImageUploadURL(
            worldcup.worldcupId,
            acceptedFile.path as string,
            acceptedFile.type
          );
        const response = await fetch(signedURL, {
          method: 'PUT',
          headers: {
            'Content-Type': acceptedFile.type,
          },
          body: acceptedFile,
        });
        if (!response.ok) {
          throw new Error('업로드 실패');
        }
        await createCandidate({
          candidateName: filenameWithoutExtension,
          mediaType: 'cdn_img',
          candidatePathname,
          worldcupId,
        });
        toast.success('업로드에 성공했습니다!');
      });
    },
    [worldcup, candidates]
  );

  const onError = (error: Error) => {
    // 에러 처리 세분화
    toast.error(error.message);
  };

  const onDropRejected = useCallback((rejectedFiles: FileRejection[]) => {
    // 최대 파일 개수 제한 오류 출력
    // 최대 파일 사이즈 제한 오류 출력
    // 지원하지 않는 파일 사이즈 제한 오류 출력
    toast.error('지원하지 않는 파일 형식이거나 파일 크기 제한을 넘었습니다.');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    // 2mb
    maxSize: 2097152,
    // maxFiles: 100,
    accept: {
      'image/png': [], // 'gif' 아직 미지원
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

  const handleUpdateWorldcupCandidates = async (formData: FormData) => {
    try {
      const formObject = Object.fromEntries(formData);
      delete formObject[videoURL];

      await updateCandidateNames(worldcupId, formObject);
      toast.success('저장되었습니다!');
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleDeleteCandidateConfirm = async () => {
    try {
      if (!selectedCandidateToDelete) {
        throw new Error('선택된 후보가 없습니다.');
      }
      // S3에 저장하고 있는 오브젝트 삭제
      if (
        selectedCandidateToDelete.mediaType === 'cdn_img' ||
        selectedCandidateToDelete.mediaType === 'cdn_video'
      ) {
        await deleteCandidateObject(
          selectedCandidateToDelete.pathname,
          worldcupId
        );
      }
      await deleteCandidate(selectedCandidateToDelete.candidateId, worldcupId);
      toast.success('삭제에 성공했습니다.');
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setShowDeleteConfirmModal(false);
    }
  };

  const handleVideoUpload = async () => {
    try {
      const UrlObject = new URL(videoURL);
      if (UrlObject.protocol != 'https:') {
        toast.error('https부터 시작하는 주소를 입력해주세요.');
        return;
      }

      const hostname = UrlObject.hostname;
      const cleanURL = UrlObject.toString();

      if (hostname === 'imgur.com' || hostname === 'www.imgur.com') {
        const candidateURL = await downloadImgurUploadS3(cleanURL, worldcupId);
        await createCandidate({
          mediaType: 'cdn_video',
          candidateName: cleanURL,
          candidatePathname: candidateURL,
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
          throw new Error('유튜브 주소가 올바른지 확인해주세요!');
        }
        const youtubeVideoURL = `https://www.youtube.com/watch?v=${youtubeVideoId}`;
        const youtubeVideoTitle = await fetchYoutubeTitle(youtubeVideoURL);

        await createCandidate({
          candidateName: youtubeVideoTitle ?? '유튜브 동영상',
          candidatePathname: youtubeVideoId,
          mediaType: 'youtube',
          worldcupId,
        });
      } else if (
        cleanURL.startsWith('https://chzzk.naver.com/clips') ||
        cleanURL.startsWith('https://chzzk.naver.com/embed/clip')
      ) {
        const chzzkIdIndex = cleanURL.lastIndexOf('/') + 1;
        const chzzkId = cleanURL.slice(chzzkIdIndex);
        const data = await crawlChzzkThumbnailURL(chzzkId);

        await createCandidate({
          candidateName: data?.chzzkClipTitle || '치지직 클립',
          thumbnailURL: data?.chzzkThumbnailURL || '',
          candidatePathname: chzzkId,
          mediaType: 'chzzk',
          worldcupId,
        });
      } else {
        throw new Error('주소가 올바른지 확인해주세요!');
      }
      setVideoURL('');
    } catch (error) {
      toast.error('잘못된 URL입니다.');
    }
  };

  const openPreview = (candidate: Candidate) => {
    setSelectedCandidateToPreview(candidate);
    setShowPreview(true);
  };

  console.log(worldcup);
  return (
    <>
      <form action={handleUpdateWorldcupCandidates}>
        <div className='rounded-md bg-gray-50 p-6'>
          <h2 className='font-semibold text-slate-700 mb-2 text-base'>
            썸네일 미리보기
          </h2>
          <div className='flex flex-col items-center justify-center'>
            <div className='p-4 w-[330px]'>
              <div className='h-[170px]'>
                <CardThumbnail worldcupCard={worldcup} />
              </div>
            </div>
            <span className='text-base text-slate-700 mb-8 flex items-center gap-1'>
              <MdInfo size={'1.5em'} className='text-primary-500' />
              썸네일은 우승을 많이 한 후보들로 업데이트 됩니다.
            </span>
          </div>
          <h2 className='font-semibold text-slate-700 mb-2 text-base'>
            후보 이미지 추가
          </h2>
          <div
            className='cursor-pointer border rounded-md mb-4 text-base bg-white p-4'
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <div className='flex items-center justify-center gap-2'>
              <FaFileUpload size={'1.5em'} className='text-primary-500' />
              <p className='text-slate-700'>
                이미지 파일을 드랍하거나 클릭해서 업로드
              </p>
            </div>
          </div>
          <h2 className='font-semibold text-slate-700 mb-2 text-base'>
            후보 동영상 추가
          </h2>
          <div className='cursor-pointer border rounded-md text-base bg-gray-50 p-2 flex items-center mb-4 relative'>
            <input
              id='videoURL'
              name='videoURL'
              className='block w-[92%] rounded-md border border-gray-200 py-1 pl-2 placeholder:text-gray-500 focus:outline-primary-500'
              type='url'
              placeholder='https://(주소입력)'
              value={videoURL}
              onChange={(e) => setVideoURL(e.target.value)}
            />
            <button
              type='button'
              onClick={handleVideoUpload}
              className='absolute px-3 py-1 bg-primary-500 text-white right-2 rounded'
            >
              추가
            </button>
          </div>
          <div className='text-base mb-6 text-gray-700'>
            <h2 className='font-semibold'>지원 형식</h2>
            <p> - imgur: https://imgur.com/tJCgmrD</p>
            <p> - youtube: https://youtube.com/tJCgmrD</p>
          </div>
          <h2 className='font-semibold text-slate-700 mb-2 text-base'>
            후보 {candidates.length}명
          </h2>
          <ul>
            {candidates
              .sort((a, b) => sortDate(a.createdAt, b.createdAt, 'newest'))
              .map((candidate, index) => (
                <li key={`${candidate.candidateId}/${candidate.pathname}`}>
                  <div className='flex items-center border rounded-md mb-4 overflow-hidden'>
                    <div className='relative w-[64px] h-[64px]'>
                      <ResponsiveThumbnailImage
                        pathname={candidate.pathname}
                        name={candidate.name}
                        mediaType={candidate.mediaType}
                        thumbnailURL={candidate?.thumbnailURL}
                        onClick={() => openPreview(candidate)}
                        size='small'
                      />
                    </div>
                    <div className='w-full flex'>
                      <input
                        className='flex-1 ml-2 mr-1 pl-4 text-base placeholder:text-gray-500 focus:outline-primary-500  border rounded-md'
                        id={candidate.name}
                        name={candidate.candidateId}
                        type='text'
                        defaultValue={candidate.name}
                        placeholder={candidate.name}
                        autoComplete='off'
                        maxLength={CANDIDATE_NAME_MAX_LENGTH}
                      />
                      <div className='flex items-center gap-1'>
                        <div className='relative'>
                          <UpdateWorldcupCandidateVideo
                            worldcupId={worldcup.worldcupId}
                            candidateId={candidate.candidateId}
                            originalPathname={candidate.pathname}
                            mediaType={candidate.mediaType}
                          />
                        </div>
                        <UpdateWorldcupCandidateImageDropzone
                          worldcupId={worldcup.worldcupId}
                          candidateId={candidate.candidateId}
                          originalPathname={candidate.pathname}
                          mediaType={candidate.mediaType}
                        />
                        <button
                          type='button'
                          className='text-red-500 px-4 py-2 border rounded-md bg-white text-base mr-2'
                          onClick={() => {
                            setSelectedCandidateToDelete(candidate);
                            setShowDeleteConfirmModal(true);
                          }}
                        >
                          <div className='flex items-center gap-1'>
                            <MdDelete className='text-red-500' size={'1.3em'} />
                            <span>삭제</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
        <div className='flex gap-4 m-4 justify-end'>
          <button className='bg-primary-500 px-4 flex h-12 items-center rounded-lg text-white font-semibold'>
            저장
          </button>
          <Link
            href={'/'}
            className='bg-gray-100 px-4 flex h-12 items-center rounded-lg font-semibold text-gray-600'
          >
            취소
          </Link>
        </div>
      </form>
      <DeleteConfirmModal
        open={showDeleteConfirmModal}
        onClose={() => {
          setShowDeleteConfirmModal(false);
          setSelectedCandidateToDelete(null);
        }}
        onConfirm={handleDeleteCandidateConfirm}
      >
        후보를 삭제하시겠습니까? <br /> 관련 통계도 전부 삭제됩니다.
      </DeleteConfirmModal>
      {selectedCandidateToPreview && (
        <Preview
          open={showPreview}
          onClose={() => {
            setShowPreview(false);
            setSelectedCandidateToPreview(null);
          }}
          src={`${selectedCandidateToPreview.pathname}?w=1920&h=1760`}
          alt={`${selectedCandidateToPreview.name}`}
        />
      )}
    </>
  );
}
