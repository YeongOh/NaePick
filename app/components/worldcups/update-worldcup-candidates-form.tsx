'use client';

import { BASE_IMAGE_URL } from '@/app/constants';
import { createCandidate } from '@/app/lib/actions/candidates/create';
import { updateCandidateNames } from '@/app/lib/actions/candidates/update';
import { Candidate, Worldcup } from '@/app/lib/definitions';
import {
  deleteCandidateObject,
  fetchCandidateImageUploadURL,
} from '@/app/lib/images';
import { excludeFileExtension } from '@/app/utils/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback } from 'react';
import { useDropzone, FileWithPath } from 'react-dropzone';
import toast from 'react-hot-toast';
import UpdateWorldcupCandidateImageDropzone from './update-worldcup-candidate-image-dropzone';
import { deleteCandidate } from '@/app/lib/actions/candidates/delete';

interface Props {
  worldcup: Worldcup;
  candidates: Candidate[];
}

export default function UpdateWorldcupCandidatesForm({
  worldcup,
  candidates,
}: Props) {
  const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
    try {
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
        console.log(response);
        if (response.ok) {
          await createCandidate(
            worldcup.worldcupId,
            candidateId,
            filenameWithoutExtension,
            candidateURL
          );
          toast.success('업로드에 성공했습니다!');
        }
      });
    } catch (error) {
      toast.error((error as Error).message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    // accept: {
    //   'image/png': ['.png'],
    //   'image/jpeg': ['.jpeg'],
    //   'image/jpg': ['.jpgg'],
    // },
    onDrop,
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

  const onClickDeleteCandidate = async (
    candidateId: string,
    candidateUrl: string
  ) => {
    if (confirm('삭제하시겠습니까?')) {
      try {
        await deleteCandidateObject(candidateUrl, worldcup.worldcupId);
        await deleteCandidate(candidateId, worldcup.worldcupId);
        toast.success('삭제 성공!');
      } catch (error) {
        toast.error((error as Error).message);
      }
    }
  };

  return (
    <form action={handleUpdateWorldcupCandidates}>
      <div className='cursor-pointer' {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag drop some files here, or click to select files</p>
        )}
      </div>
      <ul>
        {candidates.map((candidate, index) => (
          <li key={candidate.url} className='flex items-center'>
            <div className='relative w-[96px] h-[96px] rounded-lg overflow-hidden'>
              <Image
                className='object-cover'
                src={`${BASE_IMAGE_URL}${candidate.url}`}
                alt={candidate.name}
                fill={true}
                sizes='(max-width: 768px) 25vw, (max-width: 1200px) 20vw, 20vw'
              />
            </div>
            <div>
              <input
                id={candidate.name}
                name={candidate.candidateId}
                type='text'
                defaultValue={candidate.name}
                autoComplete='off'
              />
              <UpdateWorldcupCandidateImageDropzone
                worldcupId={worldcup.worldcupId}
                candidateId={candidate.candidateId}
                originalCandidateURL={candidate.url}
              />
            </div>
            <button
              type='button'
              onClick={() =>
                onClickDeleteCandidate(candidate.candidateId, candidate.url)
              }
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
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
  );
}
