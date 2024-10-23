'use client';

import { BASE_IMAGE_URL, CANDIDATE_NAME_MAX_LENGTH } from '@/app/constants';
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
import { useCallback, useState } from 'react';
import { useDropzone, FileWithPath } from 'react-dropzone';
import toast from 'react-hot-toast';
import UpdateWorldcupCandidateImageDropzone from './update-worldcup-candidate-image-dropzone';
import { deleteCandidate } from '@/app/lib/actions/candidates/delete';
import { FaFileUpload } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { sortDate } from '@/app/utils/date';

interface Props {
  worldcup: Worldcup;
  candidates: Candidate[];
}

export default function UpdateWorldcupCandidatesForm({
  worldcup,
  candidates,
}: Props) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  console.log(candidates);

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
      <div className='rounded-md bg-gray-50 p-6'>
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
            <p className='text-slate-700'>파일을 드롭하거나 클릭해서 업로드</p>
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
                  <div className='relative w-[96px] h-[96px] cursor-pointer'>
                    <Image
                      className='object-cover'
                      src={`${BASE_IMAGE_URL}${candidate.url}`}
                      alt={candidate.name}
                      fill={true}
                      sizes='(max-width: 768px) 25vw, (max-width: 1200px) 15vw, 15vw'
                      onClick={() => {
                        if (previewIndex === index) {
                          setPreviewIndex(null);
                        } else {
                          setPreviewIndex(index);
                        }
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
                        onClick={() =>
                          onClickDeleteCandidate(
                            candidate.candidateId,
                            candidate.url
                          )
                        }
                      >
                        <div className='flex items-center gap-1'>
                          <MdDelete className='text-red-500' size={'1.3em'} />
                          <span>삭제</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                {previewIndex === index && (
                  <div className='flex justify-center items-center m-4'>
                    <div className='relative w-[350px] h-[250px]'>
                      <Image
                        className='object-cover cursor-pointer rounded-md overflow-hidden'
                        src={`${BASE_IMAGE_URL}${candidate.url}`}
                        alt={candidate.name}
                        fill={true}
                        sizes='(max-width: 768px) 50vw, (max-width: 1200px) 40vw, 40vw'
                        onClick={() => setPreviewIndex(null)}
                      />
                    </div>
                  </div>
                )}
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
  );
}
