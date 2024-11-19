'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import Button from '@/app/components/ui/Button';
import FormError from '@/app/components/ui/FormError';
import FormInput from '@/app/components/ui/FormInput';
import FormTextArea from '@/app/components/ui/FormTextArea';
import LinkButton from '@/app/components/ui/link-button';
import {
  WORLDCUP_DESCRIPTION_MAX_LENGTH,
  WORLDCUP_TITLE_MAX_LENGTH,
  WORLDCUP_TITLE_MIN_LENGTH,
} from '@/app/constants';
import { Publicity, translateCategory } from '@/app/lib/types';

import { createWorldcupAction } from '../create/actions';
import { editWorldcupAction } from '../edit/[worldcup-id]/actions';
import { Category, EditingWorldcup, TWorldcupFormSchema, WorldcupFormSchema } from '../type';
import { publicityText } from '../utils';

interface Props {
  categories: Category[];
  worldcup?: EditingWorldcup;
}

export default function WorldcupForm({ categories, worldcup }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    setError,
    watch,
  } = useForm<TWorldcupFormSchema>({
    resolver: zodResolver(WorldcupFormSchema),
    defaultValues: {
      title: worldcup?.title ?? '',
      description: worldcup?.description ?? '',
      publicity: worldcup?.publicity ?? 'public',
      categoryId: worldcup?.categoryId ?? 0,
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: TWorldcupFormSchema) => {
    let result;
    if (worldcup?.id) {
      result = await editWorldcupAction(data, worldcup.id);
    } else {
      result = await createWorldcupAction(data);
    }

    if (!result?.errors) {
      if (worldcup?.id) {
        toast.success('이상형 월드컵을 수정했습니다!');
      } else {
        toast.success('이상형 월드컵이 생성되었습니다!');
      }
      return;
    }

    const errors = result.errors;
    if ('title' in errors && typeof errors.title === 'string') {
      setError('title', { type: 'server', message: errors.title });
    } else if ('description' in errors && typeof errors.description === 'string') {
      setError('description', { type: 'server', message: errors.description });
    } else if ('publicity' in errors && typeof errors.publicity === 'string') {
      setError('publicity', { type: 'server', message: errors.publicity });
    } else if ('categoryId' in errors && typeof errors.categoryId === 'string') {
      setError('categoryId', { type: 'server', message: errors.categoryId });
    } else if ('session' in errors && typeof errors.session === 'string') {
      toast.error(errors.session);
    } else {
      toast.error('예기치 못한 오류가 발생했습니다.');
    }
  };

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.target instanceof HTMLTextAreaElement) return;
    if (e.key === 'Enter') e.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col bg-gray-50 p-6"
      onKeyDown={handleFormKeyDown}
    >
      <label htmlFor="title" className="m-2 text-base font-semibold text-slate-700">
        이상형 월드컵 제목을 입력해주세요. (최소 {WORLDCUP_TITLE_MIN_LENGTH}, 최대 {WORLDCUP_TITLE_MAX_LENGTH}
        자)
      </label>
      <FormInput
        id="title"
        {...register('title')}
        defaultValue={getValues('title')}
        type="text"
        className="mb-2 p-4"
        error={errors?.title}
        placeholder="제목"
      />
      <FormError className="mb-4" error={errors?.title?.message} />
      <label htmlFor="description" className="m-2 text-base font-semibold text-slate-700">
        이상형 월드컵에 대한 설명을 입력해주세요. (최대 {WORLDCUP_DESCRIPTION_MAX_LENGTH}자)
      </label>
      <FormTextArea
        id="title"
        {...register('description')}
        defaultValue={getValues('description')}
        className="mb-1 p-4"
        error={errors?.description}
        placeholder="설명"
        rows={3}
      />
      <FormError error={errors?.description?.message} />
      <fieldset className="mt-4">
        <legend className="mb-2 ml-2 block text-base font-semibold text-slate-700">공개 범위</legend>
        <div
          className={clsx(
            'mb-2 rounded-md border border-gray-200 bg-white',
            errors?.publicity && 'outline outline-2 outline-red-500',
          )}
        >
          <div className="flex items-center gap-4 p-4 pb-2">
            <div className="flex items-center text-slate-700">
              <input
                id="public"
                {...register('publicity')}
                name="publicity"
                type="radio"
                value="public"
                className="peer/public cursor-pointer border-gray-300 bg-gray-100"
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
                {...register('publicity')}
                name="publicity"
                type="radio"
                value="unlisted"
                className="peer/unlisted cursor-pointer border-gray-300 bg-gray-100"
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
                {...register('publicity')}
                name="publicity"
                type="radio"
                value="private"
                className="peer/private cursor-pointer border-gray-300 bg-gray-100"
              />
              <label
                htmlFor="private"
                className="ml-2 cursor-pointer text-base text-gray-500 peer-checked/private:font-semibold peer-checked/private:text-primary-500"
              >
                비공개
              </label>
            </div>
          </div>
          <div className="p-4 text-base text-gray-600">{publicityText[watch('publicity') as Publicity]}</div>
        </div>
        <FormError className="mb-2" error={errors?.publicity?.message} />
      </fieldset>
      <label htmlFor="categoryId" className="m-2 block text-base font-semibold text-slate-700">
        카테고리
      </label>
      <select
        id="categoryId"
        {...register('categoryId')}
        className={clsx(
          'peer mb-2 block w-full cursor-pointer rounded-md border border-gray-200 p-4 text-base text-gray-700 outline-2 placeholder:text-gray-500 focus:outline-primary-500',
          errors?.categoryId && 'outline outline-1 outline-red-500',
        )}
        aria-describedby="categoryId-error"
      >
        <option value={0} disabled>
          카테고리를 선택해주세요.
        </option>
        {categories.map((category) => (
          <option key={`category ${category.id}`} value={category.id} className="text-base">
            {translateCategory(category.name)}
          </option>
        ))}
      </select>
      <FormError error={errors?.categoryId?.message} />
      <Button className="mt-4" variant="primary" pending={isSubmitting}>
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
