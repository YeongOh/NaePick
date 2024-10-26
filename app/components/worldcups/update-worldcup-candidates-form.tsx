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
import MyImage from '@/app/ui/my-image/my-image';
import { updateThumbnail } from '@/app/lib/actions/thumbnails/update';
import ThumbnailImage from '../thumbnail/ThumbnailImage';
import { MdInfo } from 'react-icons/md';
import Preview from '../preview/preview';
import { testImgurAPI } from '@/app/lib/actions/auth/imgur';

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

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      acceptedFiles.forEach(async (acceptedFile) => {
        const filenameWithoutExtension = excludeFileExtension(
          acceptedFile.name
        );
        const { signedURL, candidateURL, candidateId } =
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
        if (response.ok) {
          await createCandidate(
            worldcup.worldcupId,
            candidateId,
            filenameWithoutExtension,
            candidateURL
          );
          toast.success('업로드에 성공했습니다!');
        }
        if (!worldcup.leftCandidateName) {
          await updateThumbnail(worldcup.worldcupId, 'left', candidateId);
        } else if (!worldcup.rightCandidateName) {
          await updateThumbnail(worldcup.worldcupId, 'right', candidateId);
        }
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [worldcup]
  );

  const onError = (error: Error) => {
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
    maxSize: 10485760,
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
      await updateCandidateNames(worldcup.worldcupId, formObject);
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
      await deleteCandidateObject(
        selectedCandidateToDelete.url,
        worldcup.worldcupId
      );
      await deleteCandidate(
        selectedCandidateToDelete.candidateId,
        worldcup.worldcupId
      );
      toast.success('삭제에 성공했습니다.');
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setShowDeleteConfirmModal(false);
    }
  };

  const handleImgurUpload = async () => {
    try {
      //await downloadAndUploadMp4ToS3('https://i.imgur.com/a/Qty3ykP', 'test3');
      await testImgurAPI();
      console.log('here');
      // await getImgurDirectLink('https://imgur.com/a/tJCgmrD');
      toast.success('업로드완료');
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <>
      <form action={handleUpdateWorldcupCandidates}>
        <button type='button' onClick={handleImgurUpload}>
          imgur upload
        </button>
        <div className='rounded-md bg-gray-50 p-6'>
          <h2 className='font-semibold text-slate-700 mb-2 text-base'>
            썸네일 미리보기
          </h2>
          <div className='flex flex-col items-center justify-center'>
            <div className='p-4 w-[330px]'>
              <div className='h-[170px]'>
                <ThumbnailImage
                  leftCandidateName={worldcup.leftCandidateName}
                  leftCandidateUrl={worldcup.leftCandidateUrl}
                  rightCandidateName={worldcup.rightCandidateName}
                  rightCandidateUrl={worldcup.rightCandidateUrl}
                />
              </div>{' '}
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
            후보 {candidates.length}명
          </h2>
          <ul>
            {candidates
              .sort((a, b) => sortDate(a.createdAt, b.createdAt, 'newest'))
              .map((candidate, index) => (
                <li key={candidate.url}>
                  <div className='flex items-center border rounded-md mb-4 overflow-hidden'>
                    <div className='relative w-[64px] h-[64px] cursor-pointer'>
                      <MyImage
                        className='object-cover size-full'
                        src={`${candidate.url}?w=128&h=128`}
                        alt={candidate.name}
                        onClick={() => {
                          setSelectedCandidateToPreview(candidate);
                          setShowPreview(true);
                          console.log(candidate);
                        }}
                      />
                    </div>
                    <div className='w-full flex'>
                      <input
                        className='flex-1 ml-2 mr-2 pl-4 text-base placeholder:text-gray-500 focus:outline-primary-500  border rounded-md'
                        id={candidate.name}
                        name={candidate.candidateId}
                        type='text'
                        defaultValue={candidate.name}
                        placeholder={candidate.name}
                        autoComplete='off'
                        maxLength={CANDIDATE_NAME_MAX_LENGTH}
                      />
                      <div className='flex items-center'>
                        <UpdateWorldcupCandidateImageDropzone
                          worldcupId={worldcup.worldcupId}
                          candidateId={candidate.candidateId}
                          originalCandidateURL={candidate.url}
                        />
                        <button
                          type='button'
                          className='text-red-500 px-4 py-2 border rounded-md bg-white text-base mx-4'
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
          src={`${selectedCandidateToPreview.url}?w=1920&h=1760`}
          alt={`${selectedCandidateToPreview.name}`}
        />
      )}
    </>
  );
}
