'use client';

import {
  Category,
  Publicity,
  publicityText,
  translateCategory,
} from '@/app/lib/definitions';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import {
  WORLDCUP_DESCRIPTION_MAX_LENGTH,
  WORLDCUP_TITLE_MAX_LENGTH,
  WORLDCUP_TITLE_MIN_LENGTH,
} from '@/app/constants';
import {
  createWorldcup,
  CreateWorldcupFormState,
} from '@/app/lib/actions/worldcups/create';
import Input from '../ui/input';
import InputErrorMessage from '../ui/input-error-message';
import Button from '../ui/button';
import TextArea from '../ui/textarea';

interface Props {
  categories: Category[];
}

export default function CreateWorldcupForm({ categories }: Props) {
  const [publicity, setPublicity] = useState<Publicity>('public');
  const [description, setDescription] = useState('');
  const initialState: CreateWorldcupFormState = { message: null, errors: {} };
  const [state, submitCreateWorldcupForm] = useFormState(
    createWorldcup,
    initialState
  );

  const handleCreateWorldcupForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    submitCreateWorldcupForm(formData);
  };

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.target instanceof HTMLTextAreaElement) return;
    if (e.key === 'Enter') e.preventDefault();
  };

  return (
    <form
      onSubmit={handleCreateWorldcupForm}
      className='flex flex-col w-full mt-14 bg-gray-50 p-6'
      onKeyDown={handleFormKeyDown}
    >
      <div className='m-2'>
        <label
          htmlFor='title'
          className='text-base text-slate-700 font-semibold'
        >
          이상형 월드컵 제목을 입력해주세요. (최소 {WORLDCUP_TITLE_MIN_LENGTH},
          최대 {WORLDCUP_TITLE_MAX_LENGTH}자)
        </label>
      </div>
      <Input
        id='title'
        name='title'
        type='text'
        className='p-4 mb-2'
        placeholder={`제목`}
        error={state.errors?.title}
        autoFocus
      />
      <div className='mb-4'>
        <InputErrorMessage errors={state.errors?.title} />
      </div>
      <div className='m-2'>
        <label
          htmlFor='description'
          className='text-base text-slate-700 font-semibold'
        >
          이상형 월드컵에 대한 설명을 입력해주세요. (최대{' '}
          {WORLDCUP_DESCRIPTION_MAX_LENGTH}자)
        </label>
      </div>
      <TextArea
        id='description'
        name='description'
        className={`p-2 mb-1`}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder='설명'
        rows={3}
      />
      <div className='mb-4'>
        <InputErrorMessage errors={state.errors?.description} />
      </div>

      <fieldset>
        <legend className='ml-2 mb-2 block text-base font-semibold text-slate-700'>
          공개 범위
        </legend>
        <div
          className={`mb-2 rounded-md border border-gray-200 bg-white ${
            state.errors?.publicity && 'outline outline-2 outline-red-500'
          }`}
        >
          <div className='flex items-center gap-4 p-4 pb-2'>
            <div className='flex items-center text-slate-700'>
              <input
                id='public'
                name='publicity'
                type='radio'
                value='public'
                className='accent-primary-500 cursor-pointer border-gray-300 bg-gray-100 text-gray-700 focus:ring-2'
                onClick={() => setPublicity('public')}
                aria-describedby='publicity-error'
                defaultChecked={publicity === 'public'}
              />
              <label
                htmlFor='public'
                className={`ml-2 cursor-pointer text-base ${
                  publicity === 'public'
                    ? 'font-semibold text-gray-700'
                    : 'text-gray-500'
                }`}
              >
                전체 공개
              </label>
            </div>
            <div className='flex items-center'>
              <input
                id='unlisted'
                name='publicity'
                type='radio'
                value='unlisted'
                onClick={() => setPublicity('unlisted')}
                className='accent-primary-500 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2'
                aria-describedby='publicity-error'
              />
              <label
                htmlFor='unlisted'
                className={`ml-2 cursor-pointer text-base ${
                  publicity === 'unlisted'
                    ? 'font-semibold text-gray-700'
                    : 'text-gray-500'
                }`}
              >
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
                className='accent-primary-500 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2'
                aria-describedby='publicity-error'
              />
              <label
                htmlFor='private'
                className={`ml-2 cursor-pointer text-base ${
                  publicity === 'private'
                    ? 'font-semibold text-gray-700'
                    : 'text-gray-500'
                }`}
              >
                비공개
              </label>
            </div>
          </div>
          <div className='p-4 text-gray-600 text-base'>
            {publicityText[publicity]}
          </div>
        </div>
        <div className='mb-2'>
          <InputErrorMessage
            errors={state.errors?.publicity}
            replacedErrorMessage='공개 범위를 선택해주세요.'
          />
        </div>
      </fieldset>
      <div className='mb-4'>
        <label
          htmlFor='categoryId'
          className='m-2 block text-base text-slate-700 font-semibold'
        >
          카테고리
        </label>
        <select
          id='categoryId'
          name='categoryId'
          className={`text-base peer block w-full cursor-pointer rounded-md border text-gray-700 border-gray-200 p-4 outline-2 placeholder:text-gray-500 focus:outline-primary-500 mb-4 ${
            state.errors?.categoryId && 'outline outline-1 outline-red-500'
          }`}
          defaultValue=''
          aria-describedby='categoryId-error'
        >
          <option value='' disabled>
            카테고리를 선택해주세요.
          </option>
          {categories.map((category) => (
            <option
              key={`category ${category.categoryId}`}
              value={category.categoryId}
              className='text-base'
            >
              {translateCategory(category.name)}
            </option>
          ))}
        </select>
      </div>
      <InputErrorMessage errors={state.errors?.categoryId} />
      <Button className='mt-4' variant='primary'>
        이상형 월드컵 생성하기
      </Button>
    </form>
  );
}
