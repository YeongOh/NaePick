'use client';

import {
  CreateCommentResponse,
  createComment,
} from '@/app/lib/actions/comments/create';
import { Comment } from '@/app/lib/definitions';
import { getRelativeDate, sortDate } from '@/app/utils/date';
import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import TextArea from '../ui/textarea';
import Button from '../ui/button';
import InputErrorMessage from '../ui/input-error-message';
import { Pencil } from 'lucide-react';
import ToggleableP from '../ui/toggleable-p';
import { getCommentsByWorldcupId } from '@/app/lib/data/comments';

interface Props {
  numberOfComments: number;
  worldcupId: string;
  comments: Comment[];
  className?: string;
  cursor: string;
}

export default function CommentSection({
  numberOfComments,
  worldcupId,
  className,
  comments: commentsProp,
  cursor: cursorProp,
}: Props) {
  const [state, setState] = useState<CreateCommentResponse>({ errors: {} });
  const [text, setText] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [comments, setComments] = useState(commentsProp || []);
  const [numberOfNewComments, setNumberOfNewComments] = useState(0);
  const [lastCursor, setLastCursor] = useState<string | null>(cursorProp);
  const ref = useRef(null);

  const sortedComments = comments?.sort((a, b) =>
    sortDate(a.createdAt, b.createdAt, 'newest')
  );

  dayjs.extend(relativeTime);
  dayjs.locale('ko');

  const handleCommentFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const result = await createComment(text, worldcupId);
    if (!result) {
      // error
      return;
    }
    const { newComment, errors } = result;
    if (errors) {
      setState({ errors });
    } else {
      setState({ errors: {} });
    }
    if (newComment) {
      setComments((prev) => [...prev, newComment] as Comment[]);
      setNumberOfNewComments((prev) => prev + 1);
    }
    setText('');
  };

  useEffect(() => {
    const handleIntersect = async (
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver
    ) => {
      if (entries[0].isIntersecting && !isFetching && lastCursor) {
        observer.unobserve(entries[0].target);
        setIsFetching(true);
        const result = await getCommentsByWorldcupId(worldcupId, lastCursor);
        if (!result) {
          throw new Error();
        }
        console.log(result);
        const { data, cursor } = result;
        console.log(cursor);
        if (data) {
          setComments((prev) => [...prev, ...data]);
        }
        setLastCursor(cursor);
        setIsFetching(false);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.5,
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      console.log('disconnect');
      observer.disconnect();
    };
  }, [lastCursor, isFetching, worldcupId]);

  const totalNumberOfComments = numberOfComments + numberOfNewComments;

  return (
    <section className={`${className} bg-white`}>
      <div className='my-4 text-base text-slate-700 font-semibold'>
        {totalNumberOfComments > 0
          ? `댓글 ${totalNumberOfComments}개`
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
            <li
              className='mb-2'
              key={comment.commentId}
              ref={index === sortedComments.length - 1 ? ref : null}
            >
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
              <ToggleableP
                className={'text-slate-700'}
                text={comment.text}
                numberOfLines={3}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
