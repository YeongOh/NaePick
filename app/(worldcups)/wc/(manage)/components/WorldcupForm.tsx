'use client';

import { Publicity, publicityText, translateCategory } from '@/app/lib/types';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import {
  WORLDCUP_DESCRIPTION_MAX_LENGTH,
  WORLDCUP_TITLE_MAX_LENGTH,
  WORLDCUP_TITLE_MIN_LENGTH,
} from '@/app/constants';
import { createWorldcupAction, WorldcupFormState } from '@/app/(worldcups)/wc/(manage)/create/actions';
import Input from '@/app/components/ui/input';
import InputErrorMessage from '@/app/components/ui/input-error-message';
import TextArea from '@/app/components/ui/textarea';
import Button from '@/app/components/ui/button';
import { InferSelectModel } from 'drizzle-orm';
import { categories, worldcups } from '@/app/lib/database/schema';
import { editWorldcupAction } from '../edit/[worldcup-id]/actions';
import LinkButton from '@/app/components/ui/link-button';

interface Props {
  categories: InferSelectModel<typeof categories>[];
  worldcup?: Partial<InferSelectModel<typeof worldcups>>;
}

export default function WorldcupForm({ categories, worldcup }: Props) {
  const [publicity, setPublicity] = useState<Publicity>(worldcup?.publicity ? worldcup.publicity : 'public');
  const [description, setDescription] = useState<string>(worldcup?.description ? worldcup.description : '');
  const [title, setTitle] = useState<string>(worldcup?.title ? worldcup.title : '');
  const initialState: WorldcupFormState = { message: null, errors: {} };
  const [state, submitWorldcupForm] = useFormState(
    worldcup?.id ? editWorldcupAction : createWorldcupAction,
    initialState,
  );

  const handleCreateWorldcupForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (worldcup) {
      formData.append('worldcupId', String(worldcup.id));
    }
    submitWorldcupForm(formData);
  };

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.target instanceof HTMLTextAreaElement) return;
    if (e.key === 'Enter') e.preventDefault();
  };

  return (
    <form
      onSubmit={handleCreateWorldcupForm}
      className="flex w-full flex-col bg-gray-50 p-6"
      onKeyDown={handleFormKeyDown}
    >
      <div className="m-2">
        <label htmlFor="title" className="text-base font-semibold text-slate-700">
          이상형 월드컵 제목을 입력해주세요. (최소 {WORLDCUP_TITLE_MIN_LENGTH}, 최대{' '}
          {WORLDCUP_TITLE_MAX_LENGTH}자)
        </label>
      </div>
      <Input
        id="title"
        name="title"
        type="text"
        className="mb-2 p-4"
        placeholder={`제목`}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={state.errors?.title}
      />
      <div className="mb-4">
        <InputErrorMessage errors={state.errors?.title} />
      </div>
      <div className="m-2">
        <label htmlFor="description" className="text-base font-semibold text-slate-700">
          이상형 월드컵에 대한 설명을 입력해주세요. (최대 {WORLDCUP_DESCRIPTION_MAX_LENGTH}자)
        </label>
      </div>
      <TextArea
        id="description"
        name="description"
        className={`mb-1 p-4`}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="설명"
        rows={3}
      />
      <div className="mb-4">
        <InputErrorMessage errors={state.errors?.description} />
      </div>

      <fieldset>
        <legend className="mb-2 ml-2 block text-base font-semibold text-slate-700">공개 범위</legend>
        <div
          className={`mb-2 rounded-md border border-gray-200 bg-white ${
            state.errors?.publicity && 'outline outline-2 outline-red-500'
          }`}
        >
          <div className="flex items-center gap-4 p-4 pb-2">
            <div className="flex items-center text-slate-700">
              <input
                id="public"
                name="publicity"
                type="radio"
                value="public"
                className="peer/public cursor-pointer border-gray-300 bg-gray-100"
                onClick={() => setPublicity('public')}
                aria-describedby="publicity-error"
                defaultChecked={publicity === 'public'}
              />
              <label
                htmlFor="public"
                className="ml-2 cursor-pointer text-base text-gray-500 peer-checked/public:font-semibold peer-checked/public:text-primary-500"
              >
                전체 공개
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="unlisted"
                name="publicity"
                type="radio"
                value="unlisted"
                onClick={() => setPublicity('unlisted')}
                className="peer/unlisted cursor-pointer border-gray-300 bg-gray-100"
                aria-describedby="publicity-error"
                defaultChecked={publicity === 'unlisted'}
              />
              <label
                htmlFor="unlisted"
                className="ml-2 cursor-pointer text-base text-gray-500 peer-checked/unlisted:font-semibold peer-checked/unlisted:text-primary-500"
              >
                미등록
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="private"
                name="publicity"
                type="radio"
                value="private"
                onClick={() => setPublicity('private')}
                className="peer/private cursor-pointer border-gray-300 bg-gray-100"
                aria-describedby="publicity-error"
                defaultChecked={publicity === 'private'}
              />
              <label
                htmlFor="private"
                className="ml-2 cursor-pointer text-base text-gray-500 peer-checked/private:font-semibold peer-checked/private:text-primary-500"
              >
                비공개
              </label>
            </div>
          </div>
          <div className="p-4 text-base text-gray-600">{publicityText[publicity]}</div>
        </div>
        <div className="mb-2">
          <InputErrorMessage
            errors={state.errors?.publicity}
            replacedErrorMessage="공개 범위를 선택해주세요."
          />
        </div>
      </fieldset>
      <div className="mb-4">
        <label htmlFor="categoryId" className="m-2 block text-base font-semibold text-slate-700">
          카테고리
        </label>
        <select
          id="categoryId"
          name="categoryId"
          className={`peer mb-4 block w-full cursor-pointer rounded-md border border-gray-200 p-4 text-base text-gray-700 outline-2 placeholder:text-gray-500 focus:outline-primary-500 ${
            state.errors?.categoryId && 'outline outline-1 outline-red-500'
          }`}
          defaultValue=""
          aria-describedby="categoryId-error"
        >
          <option value="" disabled>
            카테고리를 선택해주세요.
          </option>
          {categories.map((category) => (
            <option key={`category ${category.id}`} value={category.id} className="text-base">
              {translateCategory(category.name)}
            </option>
          ))}
        </select>
      </div>
      <InputErrorMessage errors={state.errors?.categoryId} />
      <Button className="mt-4" variant="primary">
        {worldcup?.id ? '이상형 월드컵 수정하기' : '이상형 월드컵 생성하기'}
      </Button>
      {worldcup?.id ? (
        <LinkButton href={`/wc/${worldcup?.id}`} className="mt-2" variant="outline">
          이상형 월드컵 확인하기
        </LinkButton>
      ) : null}
    </form>
  );
}
