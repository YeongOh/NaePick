'use client';

import {
  Candidate,
  Category,
  PostInfo,
  translateCategory,
} from '@/app/lib/definitions';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, CSSProperties, useRef } from 'react';
import { useFormState } from 'react-dom';
import { useDropzone } from 'react-dropzone';
import { excludeFileExtension, formatBytes } from '@/app/utils/utils';
import {
  FILE_NAME_MAX_LENGTH,
  POST_DESCRIPTION_MAX_LENGTH,
  POST_TITLE_MAX_LENGTH,
  POST_TITLE_MIN_LENGTH,
} from '@/app/constants';
import {
  updatePost,
  UpdatePostFormState,
} from '@/app/lib/actions/posts/update';
import { BASE_IMAGE_URL } from '@/app/lib/images';

const thumbsContainer: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 24,
  marginTop: 24,
};

const thumb: CSSProperties = {
  overflow: 'hidden',
  backgroundColor: 'black',
  width: 224,
  height: 144,
  position: 'relative',
  cursor: 'pointer',
};

type Publicity = 'public' | 'private' | 'unlisted';

const publicityMessage: { [key in Publicity]: string } = {
  public: '모두에게 공개 됩니다.',
  unlisted: '링크를 가지고 있는 사용자만 볼 수 있습니다.',
  private: '만든 사용자만 볼 수 있습니다.',
};

interface Props {
  categories: Category[];
  post: PostInfo;
  candidates: Candidate[];
}

export default function UpdatePostForm({
  post,
  candidates,
  categories,
}: Props) {
  const [publicity, setPublicity] = useState<Publicity>(post.publicity);
  const [description, setDescription] = useState<string>(post.description);
  const [oldCandidates, setOldCandidates] = useState<Candidate[]>(candidates);
  const [category, setCategory] = useState<string>(String(post.categoryId));
  const [files, setFiles] = useState<(File & { preview: string })[]>([]);
  const initialState: UpdatePostFormState = { message: null, errors: {} };
  const [state, submitUpdatePostForm] = useFormState(updatePost, initialState);
  const [thumbnails, setThumbnails] = useState<string[]>([
    post.leftCandidateId,
    post.rightCandidateId,
  ]);
  const formRef = useRef<HTMLFormElement>(null);
  const [title, setTitle] = useState<string>(post.title);
  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: {
      'image/*': [],
    },
    validator: nameLengthValidator,

    onDrop: (acceptedFiles: any) => {
      const dataTransfer = new DataTransfer();

      const newF = acceptedFiles.map((file: any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      const newFiles = [...files, ...newF];
      setFiles(newFiles);
      newFiles.forEach((file) => dataTransfer.items.add(file));

      if (formRef.current) {
        const input: HTMLInputElement | null =
          formRef.current.querySelector('input[type=file]');
        if (input) {
          input.files = dataTransfer.files;
        }
      }
    },
  });
  console.log(thumbnails);

  function nameLengthValidator(file: any) {
    if (file.name.length > FILE_NAME_MAX_LENGTH) {
      return {
        code: 'name-too-large',
        message: `파일 ${file.name}의 이름이 ${FILE_NAME_MAX_LENGTH}자를 넘어 추가되지 않습니다.`,
      };
    }
    for (const eachFile of files) {
      if (eachFile.name === file.name && eachFile.size === file.size) {
        return {
          code: 'duplicate.file',
          message: `파일 ${file.name}이 중복되어 추가되지 않았습니다.`,
        };
      }
    }
    return null;
  }

  function removeOldCandidate(candidate: Candidate) {
    setOldCandidates(
      oldCandidates.filter((oldCandidate) => oldCandidate.id !== candidate.id)
    );
  }

  function handleOldCandidateNameChange(
    e: React.ChangeEvent<HTMLInputElement>,
    currentCandidate: Candidate
  ) {
    setOldCandidates(
      oldCandidates.map((candidate: Candidate) =>
        candidate.id === currentCandidate.id
          ? { ...candidate, name: e.target.value }
          : candidate
      )
    );
  }

  const oldCandidatesThumbs = oldCandidates.map(
    (candidate: Candidate, i: number) => {
      return (
        <div key={candidate.id}>
          <div
            style={thumb}
            onClick={() => {
              if (thumbnails.includes(candidate.id)) {
                setThumbnails(
                  thumbnails.filter((thumbnail) => thumbnail != candidate.id)
                );
              } else if (thumbnails.length >= 2) {
                setThumbnails([...thumbnails.slice(1), candidate.id]);
              } else {
                setThumbnails([...thumbnails, candidate.id]);
              }
            }}
          >
            <Image
              title={`${candidate.name}`}
              src={`${BASE_IMAGE_URL}${candidate.url}`}
              alt={candidate.name}
              sizes='100vw'
              className='object-cover'
              fill={true}
            />
            {thumbnails.findIndex((id) => id === candidate.id) == 0 && (
              <div className='absolute top-1 left-1 rounded-md bg-teal-500 font-semibold text-white'>
                왼쪽 썸네일
              </div>
            )}
            {thumbnails.findIndex((id) => id === candidate.id) == 1 && (
              <div className='absolute top-1 left-1 rounded-md bg-teal-500 font-semibold text-white'>
                오른쪽 썸네일
              </div>
            )}
          </div>
          <div className='flex justify-between items-center my-2'>
            <label
              htmlFor={`candidateNames[${i}]`}
              className='block font-semibold text-sm'
            >
              후보 {i + 1}
            </label>
            <button
              onClick={() => removeOldCandidate(candidate)}
              className='bg-white border border-grey-700 px-3 flex h-8 items-center rounded-lg text-red-500 font-semibold text-sm'
            >
              삭제
            </button>
          </div>
          <input
            className='block w-full border rounded-md mb-2 p-2 text-sm placeholder:text-gray-500 focus:outline-teal-500'
            id={candidate.id}
            name={candidate.name}
            placeholder={candidate.name}
            value={candidate.name}
            onChange={(e) => handleOldCandidateNameChange(e, candidate)}
          />
        </div>
      );
    }
  );

  const thumbs = files.map((file: any, i: number) => {
    const namePlaceholder = excludeFileExtension(file.name);
    const fileSize = formatBytes(file.size, 1);

    return (
      <div key={file.name}>
        <div
          style={thumb}
          onClick={() => {
            if (thumbnails.includes(file.name)) {
              setThumbnails(
                thumbnails.filter((thumbnail) => thumbnail != file.name)
              );
            } else if (thumbnails.length >= 2) {
              setThumbnails([...thumbnails.slice(1), file.name]);
            } else {
              setThumbnails([...thumbnails, file.name]);
            }
          }}
        >
          <Image
            title={`${file.name} - ${fileSize}`}
            src={file.preview}
            alt={file.preview}
            sizes='100vw'
            className='object-cover'
            fill={true}
            onLoad={() => {
              URL.revokeObjectURL(file.preview);
            }}
          />
          {thumbnails.findIndex((name) => name == file.name) == 0 && (
            <div className='absolute top-1 left-1 rounded-md bg-teal-500 font-semibold text-white'>
              왼쪽 썸네일
            </div>
          )}
          {thumbnails.findIndex((name) => name == file.name) == 1 && (
            <div className='absolute top-1 left-1 rounded-md bg-teal-500 font-semibold text-white'>
              오른쪽 썸네일
            </div>
          )}
        </div>
        <div className='flex justify-between items-center my-2'>
          <label
            htmlFor={`candidateNames[${i}]`}
            className='block font-semibold text-sm'
          >
            후보 {oldCandidates.length + i + 1}
          </label>
          <button
            onClick={() => removeCandidate(i)}
            className='bg-white border border-grey-700 px-3 flex h-8 items-center rounded-lg text-red-500 font-semibold text-sm'
          >
            삭제
          </button>
        </div>
        <input
          className='block w-full border rounded-md mb-2 p-2 text-sm placeholder:text-gray-500 focus:outline-teal-500'
          id={`candidateNames[${i}]`}
          name={`candidateNames[${i}]`}
          placeholder={namePlaceholder}
          defaultValue={namePlaceholder}
        />
      </div>
    );
  });

  function removeCandidate(i: number): void {
    setFiles([...files.slice(0, i), ...files.slice(i + 1)]);
  }

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  function handleUpdatePostFormSubmit(formData: FormData) {
    if (formRef.current) {
      const input: HTMLInputElement | null =
        formRef.current.querySelector('input[type=file]');
      if (input && input.files) {
        Array.from(input.files).forEach((file, i) =>
          formData.append(`imageFiles[${i}]`, file)
        );
      }
    }
    formData.append(
      'numberOfCandidates',
      String(files.length + oldCandidates.length)
    );
    formData.append('thumbnails', JSON.stringify(thumbnails));
    formData.append('oldCandidates', JSON.stringify(oldCandidates));
    formData.append('id', post.id);
    submitUpdatePostForm(formData);
  }

  return (
    <form action={handleUpdatePostFormSubmit} ref={formRef}>
      <div className='rounded-md bg-gray-50 p-6'>
        <label htmlFor='title' className='ml-2 mb-2 block font-semibold'>
          제목
        </label>
        <input
          id='title'
          name='title'
          type='text'
          className={`block w-full rounded-md border mb-4 border-gray-200 py-2 pl-4 placeholder:text-gray-500 focus:outline-teal-500 ${
            state.errors?.title && 'outline outline-1 outline-red-500'
          }`}
          placeholder={`이상형 월드컵 제목을 입력해주세요. (최소 ${POST_TITLE_MIN_LENGTH}, 최대 ${POST_TITLE_MAX_LENGTH}자)`}
          value={title}
          aria-describedby='title-error'
          onChange={(e) => setTitle(e.target.value)}
        />
        <div id='title-error' aria-live='polite' aria-atomic='true'>
          {state.errors?.title &&
            state.errors.title.map((error: string) => (
              <p className='m-2 mb-4 text-red-500' key={error}>
                {error}
              </p>
            ))}
        </div>
        <label htmlFor='description' className='ml-2 mb-2 block font-semibold'>
          설명
        </label>
        <input
          id='description'
          name='description'
          className={`block w-full rounded-md border mb-4 border-gray-200 py-2 pl-4 placeholder:text-gray-500 focus:outline-teal-500 ${
            state.errors?.description && 'outline outline-1 outline-red-500'
          }`}
          placeholder={`이상형 월드컵에 대한 설명을 입력해주세요. (최대 ${POST_DESCRIPTION_MAX_LENGTH}자)`}
          aria-describedby='description-error'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div id='description-error' aria-live='polite' aria-atomic='true'>
          {state.errors?.description &&
            state.errors.description.map((error: string) => (
              <p className='m-2 mb-4 text-red-500' key={error}>
                {error}
              </p>
            ))}
        </div>
        <fieldset className='mb-4'>
          <legend className='ml-2 mb-2 block font-semibold'>공개 범위</legend>
          <div
            className={`rounded-md border border-gray-200 bg-white ${
              state.errors?.publicity && 'outline outline-1 outline-red-500'
            }`}
          >
            <div className='flex items-center gap-4 p-4 pb-2'>
              <div className='flex items-center'>
                <input
                  id='public'
                  name='publicity'
                  type='radio'
                  value='public'
                  className='h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2'
                  onChange={() => setPublicity('public')}
                  aria-describedby='publicity-error'
                  defaultChecked={publicity === 'public'}
                />
                <label htmlFor='public' className='ml-2 cursor-pointer'>
                  전체 공개
                </label>
              </div>
              <div className='flex items-center'>
                <input
                  id='unlisted'
                  name='publicity'
                  type='radio'
                  value='unlisted'
                  onChange={() => setPublicity('unlisted')}
                  className='h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2'
                  aria-describedby='publicity-error'
                  defaultChecked={publicity === 'unlisted'}
                />
                <label htmlFor='unlisted' className='ml-2 cursor-pointer'>
                  미등록
                </label>
              </div>
              <div className='flex items-center'>
                <input
                  id='private'
                  name='publicity'
                  type='radio'
                  value='private'
                  onClick={() => setPublicity('private')}
                  className='h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2'
                  aria-describedby='publicity-error'
                  defaultChecked={publicity === 'private'}
                />
                <label htmlFor='private' className='ml-2 cursor-pointer'>
                  비공개
                </label>
              </div>
            </div>
            <div className='py-2 px-4 text-gray-600'>
              {publicityMessage[publicity]}
            </div>
          </div>
          <div id='publicity-error' aria-live='polite' aria-atomic='true'>
            {state.errors?.publicity &&
              state.errors.publicity.map((error: string) => (
                <p className='m-2 text-red-500' key={error}>
                  공개 범위를 선택해주세요.
                </p>
              ))}
          </div>
        </fieldset>
        <div className='mb-4'>
          <label
            htmlFor='description'
            className='ml-2 mb-2 block font-semibold'
          >
            카테고리
          </label>
          <select
            id='categoryId'
            name='categoryId'
            className={`peer block w-full cursor-pointer rounded-md border border-gray-200 p-2 outline-2 placeholder:text-gray-500 focus:outline-teal-500 mb-4 ${
              state.errors?.categoryId && 'outline outline-1 outline-red-500'
            }`}
            defaultValue={post.categoryId}
            onChange={(e) => setCategory(e.target.value)}
            aria-describedby='categoryId-error'
          >
            <option value='' disabled>
              카테고리를 선택해주세요.
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {translateCategory(category.name)}
              </option>
            ))}
          </select>
        </div>
        <div id='categoryId-error' aria-live='polite' aria-atomic='true'>
          {state.errors?.categoryId &&
            state.errors.categoryId.map((error: string) => (
              <p className='m-2 mb-4 text-red-500' key={error}>
                카테고리를 선택해주세요.
              </p>
            ))}
        </div>

        <section>
          <label
            htmlFor='dropzoneInput'
            className='ml-2 mb-2 block font-semibold'
          >
            후보 추가하기
          </label>
          <div
            className={`border rounded-md mb-2 p-4 cursor-pointer bg-white hover:bg-gray-50 ${
              state.errors?.numberOfCandidates &&
              'outline outline-1 outline-red-500'
            }`}
          >
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps({ id: 'dropzoneInput' })} />
              <p className='text-gray-600'>
                선택해서 파일을 추가하거나 드롭하세요.
              </p>
            </div>
          </div>
          <div
            id='numberOfCandidates-error'
            aria-live='polite'
            aria-atomic='true'
          >
            {state.errors?.numberOfCandidates &&
              state.errors.numberOfCandidates.map((error: string) => (
                <p className='m-2 text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
          <div id='thumbnails-error' aria-live='polite' aria-atomic='true'>
            {state.errors?.thumbnails &&
              state.errors.thumbnails.map((error: string) => (
                <p className='m-2 text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
          {fileRejections &&
            fileRejections.map(({ file, errors }) => (
              <>
                {errors.map((e, i) => (
                  <p className='m-2 text-red-500' key={i}>
                    {e.message}
                  </p>
                ))}
              </>
            ))}
          <div className='ml-2 mb-2 mt-4 font-semibold'>
            {files.length > 0 || oldCandidates.length > 0
              ? `총 ${oldCandidates.length + files.length}명의 후보`
              : '최소 2명의 후보가 필요합니다.'}
          </div>
          <div>이전 후보는 현재 이름 수정, 혹은 후보 삭제만 지원합니다.</div>
          <aside style={thumbsContainer}>{oldCandidatesThumbs}</aside>
          <aside style={thumbsContainer}>{thumbs}</aside>
        </section>
      </div>
      {state.message && (
        <div
          className='flex justify-center text-red-500 p-4'
          key={state.message}
        >
          {state.message}
        </div>
      )}
      <div className='flex gap-4 m-4 justify-end '>
        <button className='bg-teal-500 px-4 flex h-12 items-center rounded-lg text-white font-semibold'>
          수정하기
        </button>
        <Link
          href={'/posts/'}
          className='bg-gray-100 px-4 flex h-12 items-center rounded-lg font-semibold text-gray-600'
        >
          취소
        </Link>
      </div>
    </form>
  );
}