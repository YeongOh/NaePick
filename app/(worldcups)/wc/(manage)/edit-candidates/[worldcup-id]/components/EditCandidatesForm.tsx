'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  deleteCandidateAction,
  deleteCandidateObject,
  updateCandidateNamesAction,
} from '@/app/(worldcups)/wc/(manage)/edit-candidates/[worldcup-id]/actions';
import CandidateMedia from '@/app/components/CandidateMedia';
import CandidateThumbnail from '@/app/components/CandidateThumbnail';
import DeleteConfirmModal from '@/app/components/Modal/DeleteConfirmModal';
import Pagination from '@/app/components/Pagination';
import { MIN_NUMBER_OF_CANDIDATES } from '@/app/constants';
import Button from '@/app/ui/Button';
import FormError from '@/app/ui/FormError';
import LinkButton from '@/app/ui/LinkButton';
import Spinner from '@/app/ui/Spinner';
import dayjs from '@/app/utils/dayjs';
import EditImageButton from './EditImageButton';
import EditVideoButton from './EditVideoButton';
import UploadImageZone from './UploadImageZone';
import UploadVideoZone from './UploadVideoZone';
import { CandidateDataSchema, TCandidateDataSchema } from '../../../type';
import { translateMediaType } from '../../../utils';

interface Candidate {
  mediaType: string;
  id: string;
  name: string;
  path: string;
  thumbnailUrl: string | null;
  worldcupId: string;
  mediaTypeId: number;
  createdAt: string;
  updatedAt: string;
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const totalPages = Math.ceil((count || 0) / 10);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<TCandidateDataSchema>({
    resolver: zodResolver(CandidateDataSchema),
    mode: 'onChange',
  });
  const { fields } = useFieldArray({
    control,
    name: 'candidates',
  });

  const handleOnChangeUpdateVideoInputIndex = (index: number | null) => {
    setShowVideoInputIndex(index);
  };

  const onSubmit = async (data: TCandidateDataSchema) => {
    const result = await updateCandidateNamesAction(data, worldcupId);
    if (!result?.errors) {
      toast.success('저장되었습니다!');
      return;
    }

    const errors = result.errors;
    if ('id' in errors && typeof errors.id === 'string') {
      toast.error('잘못된 데이터로 인해 저장할 수 없었습니다.');
    } else if ('session' in errors && typeof errors.session === 'string') {
      toast.error(errors.session);
    } else if ('candidates' in errors && typeof errors.candidates === 'string') {
      toast.error(errors.candidates);
    } else {
      toast.error('예기치 못한 문제로 저장할 수 없었습니다.');
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

  const handlePageNumberOnClick = async (page: number) => {
    router.push(`/wc/edit-candidates/${worldcupId}?page=${page}`, {
      scroll: false,
    });
  };

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-md bg-gray-50 p-6"
        onKeyDown={handleFormKeyDown}
      >
        <UploadImageZone worldcupId={worldcupId} isLoading={isLoading} setIsLoading={setIsLoading} />
        <UploadVideoZone worldcupId={worldcupId} isLoading={isLoading} setIsLoading={setIsLoading} />
        <h2 className="mb-2 text-base font-semibold text-slate-700">
          {count === 0 ? '아직 후보가 충분하지 않네요!' : `후보 ${count}명`}
        </h2>
        {count < MIN_NUMBER_OF_CANDIDATES ? (
          <p className="mb-4 pl-2 text-base text-gray-500">
            - {MIN_NUMBER_OF_CANDIDATES - count}명을 더 추가하면 이상형 월드컵을 시작할 수 있습니다.
          </p>
        ) : null}
        {isLoading ? (
          <div className="my-4 flex h-[64px] w-full animate-pulse items-center justify-center rounded border bg-gray-100">
            <Spinner />
          </div>
        ) : null}
        <ul>
          {candidates.map((candidate, candidateIndex) => (
            <li key={`${candidate.id}/${candidate.path}`}>
              <div className="mb-4 flex items-center rounded-md border bg-gray-100 p-2">
                <div className="relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-md">
                  <CandidateThumbnail
                    path={candidate.path}
                    name={candidate.name}
                    mediaType={candidate.mediaType}
                    thumbnailURL={candidate.thumbnailUrl}
                    onClick={() => {
                      setSelectedCandidateToPreviewIndex(
                        candidateIndex === selectedCandidateToPreviewIndex ? null : candidateIndex,
                      );
                    }}
                    size="small"
                  />
                </div>
                <div className="relative flex w-full flex-col pl-2">
                  <input
                    type="hidden"
                    {...register(`candidates.${candidateIndex}.id`)}
                    defaultValue={candidate.id}
                  />
                  <input
                    className={clsx(
                      'flex-1 rounded-md border p-1 text-base text-slate-700 placeholder:text-gray-500 focus:outline-primary-500',
                      errors.candidates?.[candidateIndex] && 'outline outline-2 outline-red-500',
                    )}
                    {...register(`candidates.${candidateIndex}.name`)}
                    defaultValue={candidate.name}
                    type="text"
                    autoComplete="off"
                  />
                  <FormError
                    className="absolute -top-9 rounded-md border bg-white p-1"
                    error={errors.candidates?.[candidateIndex]?.name?.message}
                  />
                  <div className="mt-2 flex justify-between">
                    <div className="mr-1 text-sm text-gray-500">
                      <div className="mr-2">{translateMediaType(candidate.mediaType)}</div>
                      <div>{dayjs(candidate.createdAt).format('YYYY-MM-DD')}</div>
                    </div>
                    <div className="flex gap-2">
                      <EditVideoButton
                        worldcupId={worldcupId}
                        candidateId={candidate.id}
                        originalPath={candidate.path}
                        mediaType={candidate.mediaType}
                        candidateIndex={candidateIndex}
                        onChangeVideoInputIndex={handleOnChangeUpdateVideoInputIndex}
                        showVideoURLInput={showUpdateVideoInputIndex === candidateIndex}
                      />
                      <EditImageButton
                        worldcupId={worldcupId}
                        candidateId={candidate.id}
                        originalPath={candidate.path}
                        mediaType={candidate.mediaType}
                      />
                      <Button
                        type="button"
                        variant="delete"
                        size="sm"
                        onClick={() => {
                          setSelectedCandidateToDelete(candidate);
                          setShowDeleteConfirmModal(true);
                        }}
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              {selectedCandidateToPreviewIndex === candidateIndex && (
                <div className="my-8 flex h-[400px] w-full justify-center bg-black">
                  <CandidateMedia
                    path={candidate.path}
                    name={candidate.name}
                    mediaType={candidate.mediaType}
                  />
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
        <Button pending={isSubmitting} className="mt-8 w-full" variant="primary">
          이상형 월드컵 후보 이름 저장
        </Button>
        <div className="flex">
          <LinkButton href={`/wc/${worldcupId}`} className="mt-2 w-full" variant="outline">
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
