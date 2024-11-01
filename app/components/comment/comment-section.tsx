'use client';

import { CommentState, createComment } from '@/app/lib/actions/comments/create';
import { Comment } from '@/app/lib/definitions';
import { getRelativeDate, sortDate } from '@/app/utils/date';
import React, { useState } from 'react';
import { useFormState } from 'react-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import TextArea from '../ui/textarea';
import Button from '../ui/button';
import InputErrorMessage from '../ui/input-error-message';
import { Pencil } from 'lucide-react';

interface Props {
  worldcupId: string;
  comments?: Comment[];
  className?: string;
}

export default function CommentSection({
  worldcupId,
  comments,
  className,
}: Props) {
  const initialState: CommentState = { message: null, errors: {} };
  const [state, submitCommentForm] = useFormState(createComment, initialState);
  const [text, setText] = useState('');

  const sortedComments = comments?.sort((a, b) =>
    sortDate(a.createdAt, b.createdAt, 'newest')
  );

  dayjs.extend(relativeTime);
  dayjs.locale('ko');

  const handleCommentFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('worldcupId', worldcupId);
    submitCommentForm(formData);
    setText('');
  };

  return (
    <section className={`${className} bg-white`}>
      <div className='my-4 text-base text-slate-700 font-semibold'>
        {comments && comments.length > 0
          ? `댓글 ${comments.length}개`
          : `댓글을 남겨주세요.`}
      </div>
      <form onSubmit={handleCommentFormSubmit}>
        <TextArea
          id='text'
          name='text'
          value={text}
          error={state.errors?.text}
          className={`p-2 mb-1`}
          onChange={(e) => setText(e.target.value)}
          placeholder='댓글 내용'
          rows={1}
          autoFocus
        />
        <InputErrorMessage className='mb-1' errors={state.errors?.text} />
        <Button
          variant='primary'
          className='flex justify-center items-center gap-1 my-1'
        >
          <Pencil color='#FFFFFF' size='1.2rem' />
          댓글 추가하기
        </Button>
      </form>
      {comments ? (
        <ul>
          {sortedComments?.map((comment, index) => (
            <li className='mb-2' key={comment.commentId}>
              <div className='mb-1'>
                <span
                  className={`mr-4 font-semibold text-base ${
                    !comment.isAnonymous && comment.nickname
                      ? 'text-slate-700'
                      : 'text-gray-500'
                  }`}
                >
                  {comment.isAnonymous
                    ? '익명'
                    : comment.nickname
                    ? comment.nickname
                    : '탈퇴한 회원'}
                </span>
                <span
                  className='text-sm text-gray-500'
                  title={dayjs(comment.createdAt).format(
                    'YYYY년 MM월 DD일 HH시 MM분'
                  )}
                >
                  {getRelativeDate(comment.createdAt)}
                </span>
              </div>
              <div className='text-base text-slate-700 pl-1'>
                {comment.text.split('\n').map((line, index) => (
                  <React.Fragment key={`comment.commentId-${index}`}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
