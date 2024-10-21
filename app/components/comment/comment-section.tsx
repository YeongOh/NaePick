'use client';

import { COMMENT_TEXT_MAX_LENGTH } from '@/app/constants';
import { CommentState, createComment } from '@/app/lib/actions/comments';
import { Comment, SessionData } from '@/app/lib/definitions';
import { getRelativeDate, sortDate } from '@/app/utils/date';
import { useState } from 'react';
import { useFormState } from 'react-dom';

interface Props {
  worldcupId: string;
  session?: SessionData;
  comments?: Comment[];
}

export default function CommentSection({
  session,
  worldcupId,
  comments,
}: Props) {
  const initialState: CommentState = { message: null, errors: {} };
  const [state, submitCommentForm] = useFormState(createComment, initialState);
  const [text, setText] = useState<string>('');
  const isAuth = !!session?.userId;

  function handleCommentFormSubmit(formData: FormData) {
    if (!session?.userId) {
      return;
    }
    formData.append('worldcupId', worldcupId);
    submitCommentForm(formData);
    setText('');
  }

  const sortedComments = comments?.sort((a, b) =>
    sortDate(a.createdAt, b.createdAt, 'newest')
  );

  return (
    <section className='p-8'>
      <div className='my-4 text-lg font-semibold'>
        {comments && comments.length > 0
          ? `댓글 ${comments.length}개`
          : `댓글을 추가해보세요.`}
      </div>
      <form action={handleCommentFormSubmit}>
        <input
          id='text'
          name='text'
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={`text-lg block w-full rounded-md border mb-4 border-gray-200 py-2 pl-4 placeholder:text-gray-500 focus:outline-primary-500 
              ${state.errors?.text && 'outline outline-1 outline-red-500'}`}
          placeholder={
            isAuth ? `댓글 추가... ` : '로그인이 필요한 서비스입니다.'
          }
          aria-describedby='text-error'
          autoComplete='off'
          maxLength={COMMENT_TEXT_MAX_LENGTH}
          disabled={!isAuth}
        />
        {state.errors?.text &&
          state.errors.text.map((error: string) => (
            <p className='m-2 mb-4 text-red-500' key={error}>
              {error}
            </p>
          ))}
        {isAuth && (
          <div className='flex gap-4 m-4 justify-end'>
            <button className='bg-primary-500 px-4 flex h-12 items-center rounded-lg text-white font-semibold text-base'>
              댓글
            </button>
            <button
              type='button'
              className='bg-gray-100 px-4 flex h-12 items-center rounded-lg font-semibold text-gray-600 text-base'
            >
              취소
            </button>
          </div>
        )}
      </form>
      {comments ? (
        <ul>
          {sortedComments?.map((comment) => (
            <li className='mb-4' key={comment.id}>
              <div className='mb-2'>
                <span className='text-gray-500 mr-4 '>{comment.nickname}</span>
                <span className='text-base'>
                  {getRelativeDate(comment.createdAt)}
                </span>
              </div>
              <div>{comment.text}</div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
