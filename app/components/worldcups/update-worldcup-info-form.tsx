'use client';

import {
  Category,
  Publicity,
  translateCategory,
  Worldcup,
  publicityText,
} from '@/app/lib/definitions';
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
import Input from '../ui/input';
import InputErrorMessage from '../ui/input-error-message';
import Button from '../ui/button';
import TextArea from '../ui/textarea';
import LinkButton from '../ui/link-button';

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
  const [title, setTitle] = useState<string>(worldcup.title);
  const [state, submitUpdateWorldcupInfoForm] = useFormState(
    updateWorldcupInfo,
    initialState
  );

  const handleUpdateWorldcupInfoFormSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('worldcupId', worldcup.worldcupId);
    submitUpdateWorldcupInfoForm(formData);
  };

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.target instanceof HTMLTextAreaElement) return;
    if (e.key === 'Enter') e.preventDefault();
  };

  return (
    <form
      onSubmit={handleUpdateWorldcupInfoFormSubmit}
      className='flex flex-col w-full bg-gray-50 p-6'
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
        value={title}
        onChange={(e) => setTitle(e.target.value)}
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
                className='cursor-pointer border-gray-300 bg-gray-100 peer/public'
                onClick={() => setPublicity('public')}
                aria-describedby='publicity-error'
                defaultChecked={publicity === 'public'}
              />
              <label
                htmlFor='public'
                className='ml-2 cursor-pointer text-gray-500 text-base peer-checked/public:text-primary-500 peer-checked/public:font-semibold'
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
                className='cursor-pointer border-gray-300 bg-gray-100 peer/unlisted'
                aria-describedby='publicity-error'
                defaultChecked={publicity === 'unlisted'}
              />
              <label
                htmlFor='unlisted'
                className='ml-2 cursor-pointer text-base text-gray-500 peer-checked/unlisted:text-primary-500 peer-checked/unlisted:font-semibold'
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
                className='cursor-pointer border-gray-300 bg-gray-100 peer/private'
                aria-describedby='publicity-error'
                defaultChecked={publicity === 'private'}
              />
              <label
                htmlFor='private'
                className='ml-2 cursor-pointer text-gray-500 text-base peer-checked/private:text-primary-500 peer-checked/private:font-semibold'
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
          <option value={worldcup.categoryId} disabled>
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
      <Button variant='primary'>이상형 월드컵 수정하기</Button>
      <LinkButton
        href={`/worldcups/${worldcup.worldcupId}`}
        className='mt-2'
        variant='outline'
      >
        이상형 월드컵 확인하기
      </LinkButton>
    </form>
  );
}
