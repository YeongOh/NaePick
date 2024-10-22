'use client';

import {
  Category,
  Publicity,
  translateCategory,
  Worldcup,
  publicityText,
} from '@/app/lib/definitions';
import Link from 'next/link';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import {
  WORLDCUP_DESCRIPTION_MAX_LENGTH,
  WORLDCUP_TITLE_MAX_LENGTH,
  WORLDCUP_TITLE_MIN_LENGTH,
} from '@/app/constants';
import {
  updateWorldcupInfo,
  UpdateWorldcupInfoFormState,
} from '@/app/lib/actions/worldcups/update';

interface Props {
  categories: Category[];
  worldcup: Worldcup;
}

export default function UpdateWorldcupInfoForm({
  worldcup,
  categories,
}: Props) {
  const initialState: UpdateWorldcupInfoFormState = {
    message: null,
    errors: {},
  };
  const [publicity, setPublicity] = useState<Publicity>(worldcup.publicity);
  const [description, setDescription] = useState<string>(worldcup.description);
  const [category, setCategory] = useState<string>(String(worldcup.categoryId));
  const [title, setTitle] = useState<string>(worldcup.title);
  const [state, submitUpdateWorldcupInfoForm] = useFormState(
    updateWorldcupInfo,
    initialState
  );

  const handleUpdateWorldcupInfoFormSubmit = (formData: FormData) => {
    formData.append('worldcupId', worldcup.worldcupId);
    submitUpdateWorldcupInfoForm(formData);
  };

  return (
    <form action={handleUpdateWorldcupInfoFormSubmit}>
      <div className='rounded-md bg-gray-50 p-6'>
        <label htmlFor='title' className='ml-2 mb-2 block font-semibold'>
          제목
        </label>
        <input
          id='title'
          name='title'
          type='text'
          className={`block w-full rounded-md border mb-4 border-gray-200 py-2 pl-4 placeholder:text-gray-500 focus:outline-primary-500 ${
            state.errors?.title && 'outline outline-1 outline-red-500'
          }`}
          placeholder={`이상형 월드컵 제목을 입력해주세요. (최소 ${WORLDCUP_TITLE_MIN_LENGTH}, 최대 ${WORLDCUP_TITLE_MAX_LENGTH}자)`}
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
          className={`block w-full rounded-md border mb-4 border-gray-200 py-2 pl-4 placeholder:text-gray-500 focus:outline-primary-500 ${
            state.errors?.description && 'outline outline-1 outline-red-500'
          }`}
          placeholder={`이상형 월드컵에 대한 설명을 입력해주세요. (최대 ${WORLDCUP_DESCRIPTION_MAX_LENGTH}자)`}
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
              {publicityText[publicity]}
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
            className={`peer block w-full cursor-pointer rounded-md border border-gray-200 p-2 outline-2 placeholder:text-gray-500 focus:outline-primary-500 mb-4 ${
              state.errors?.categoryId && 'outline outline-1 outline-red-500'
            }`}
            defaultValue={worldcup.categoryId}
            onChange={(e) => setCategory(e.target.value)}
            aria-describedby='categoryId-error'
          >
            <option value='' disabled>
              카테고리를 선택해주세요.
            </option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
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
        <button className='bg-primary-500 px-4 flex h-12 items-center rounded-lg text-white font-semibold'>
          수정하기
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
