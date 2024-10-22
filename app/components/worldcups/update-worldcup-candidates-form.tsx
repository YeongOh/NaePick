'use client';

import { BASE_IMAGE_URL } from '@/app/constants';
import { createCandidate } from '@/app/lib/actions/candidates/create';
import { updateCandidateNames } from '@/app/lib/actions/candidates/update';
import { Candidate, Worldcup } from '@/app/lib/definitions';
import { deleteS3Image, fetchCandidateImageUploadURL } from '@/app/lib/images';
import { excludeFileExtension } from '@/app/utils/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback } from 'react';
import { useDropzone, FileWithPath } from 'react-dropzone';
import toast from 'react-hot-toast';
import UpdateCandidateImageDropzone from './update-candidate-image-dropzone';
import { deleteCandidate } from '@/app/lib/actions/candidates/delete';

interface Props {
  worldcup: Worldcup;
  candidates: Candidate[];
}

export default function UpdateWorldcupCandidatesForm({
  worldcup,
  candidates,
}: Props) {
  console.log(candidates);
  const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
    // Do something with the files
    console.log(acceptedFiles);
    const file = acceptedFiles[0];
    const filenameWithoutExtension = excludeFileExtension(file.name);
    const { signedURL, candidateURL, candidateId } =
      await fetchCandidateImageUploadURL(
        worldcup.worldcupId,
        file.path as string,
        file.type
      );
    const response = await fetch(signedURL, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });
    console.log(response);
    if (response.ok) {
      await createCandidate(
        worldcup.worldcupId,
        candidateId,
        filenameWithoutExtension,
        candidateURL
      );
      toast.error('업로드에 성공했습니다!');
    } else {
      toast.error('업로드에 실패했습니다.');
    }
    // 후보 레코드 생성
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
    const formObject = Object.fromEntries(formData);
    console.log(formObject);
    await updateCandidateNames(worldcup.worldcupId, formObject);
    toast.success('저장되었습니다!');
  };

  const onClickDeleteCandidate = async (
    candidateId: string,
    candidateUrl: string
  ) => {
    if (confirm('삭제하시겠습니까?')) {
      await deleteS3Image(candidateUrl);
      await deleteCandidate(worldcup.worldcupId, candidateId);
      toast.success('삭제 성공!');
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
              <UpdateCandidateImageDropzone
                worldcupId={worldcup.worldcupId}
                candidateId={candidate.candidateId}
                originalCandidateURL={candidate.url}
              />
            </div>
            <button
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
