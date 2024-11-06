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
import { EllipsisVertical, Pencil } from 'lucide-react';
import ToggleableP from '../ui/toggleable-p';
import { getCommentsByWorldcupId } from '@/app/lib/data/comments';
import CommentDropdownMenu from './comment-dropdown-menu';
import DeleteConfirmModal from '../modal/delete-confirm-modal';
import { deleteComment } from '@/app/lib/actions/comments/delete';
import toast from 'react-hot-toast';
import { updateComment } from '@/app/lib/actions/comments/update';
import { COMMENT_TEXT_MAX_LENGTH } from '@/app/constants';
import ProfileImage from '../ui/profile-image';

interface Props {
  numberOfComments: number;
  worldcupId: string;
  className?: string;
  finalWinnerCandidateId?: string | null;
  userId?: string;
}

export default function CommentSection({
  numberOfComments,
  worldcupId,
  className,
  userId,
  finalWinnerCandidateId = null,
}: Props) {
  const [state, setState] = useState<CreateCommentResponse>({ errors: {} });
  const [text, setText] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [numberOfNewComments, setNumberOfNewComments] = useState(0);
  const [lastCursor, setLastCursor] = useState<string | null>(null);
  const ref = useRef(null);
  const [dropdownMenuId, setDropdownMenuId] = useState<string | null>(null);
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] =
    useState<boolean>(false);
  const [updateCommentId, setUpdateCommentId] = useState<string | null>(null);
  const [newText, setNewText] = useState('');

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.dropdown-menu') &&
      !target.closest('.dropdown-menu-toggle') &&
      !target.closest('.modal')
    ) {
      setDropdownMenuId(null);
    }
  };

  useEffect(() => {
    if (dropdownMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownMenuId]);

  useEffect(() => {
    getCommentsByWorldcupId(worldcupId).then((result) => {
      if (result) {
        const { data, cursor } = result;
        setComments(data || []);
        setLastCursor(cursor);
      }
    });
  }, [worldcupId]);

  const sortedComments = comments?.sort((a, b) =>
    sortDate(a.createdAt, b.createdAt, 'newest')
  );

  dayjs.extend(relativeTime);
  dayjs.locale('ko');

  const handleDeleteComment = async () => {
    const targetCommentId = dropdownMenuId;
    try {
      if (!targetCommentId) return;

      await deleteComment(targetCommentId);
      const newComments = comments.filter(
        (comment) => comment.commentId != targetCommentId
      );
      setComments(newComments);
      toast.success('댓글이 삭제되었습니다.');
    } catch (error) {
      toast.error('댓글을 삭제하지 못했습니다.');
    } finally {
      setOpenDeleteConfirmModal(false);
      setDropdownMenuId(null);
    }
  };

  const handleEditTextSubmit = async () => {
    try {
      if (!updateCommentId) return;
      if (newText.length <= 0) {
        toast.error('최소 0자 이상이어야 합니다.');
        return;
      }
      if (newText.length > COMMENT_TEXT_MAX_LENGTH) {
        toast.error(`최소 ${COMMENT_TEXT_MAX_LENGTH}자 이하여야 합니다.`);
        return;
      }

      await updateComment(updateCommentId, newText);
      const newComments = comments.map((comment) =>
        comment.commentId === updateCommentId
          ? { ...comment, text: newText }
          : comment
      );
      setComments(newComments);
      setNewText('');
      setUpdateCommentId(null);
      toast.success('댓글이 수정되었습니다.');
    } catch (error) {
      toast.error('댓글을 수정하지 못했습니다.');
    }
  };

  const handleCommentFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const result = await createComment(
      text,
      worldcupId,
      finalWinnerCandidateId
    );
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
        const { data, cursor } = result;
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
          rows={2}
          autoFocus
        />
        <InputErrorMessage className='mb-1' errors={state.errors?.text} />
        <Button
          variant='primary'
          className='flex justify-center items-center gap-1 mt-1 mb-4'
        >
          <Pencil color='#FFFFFF' size='1.2rem' />
          댓글 추가하기
        </Button>
      </form>
      {comments ? (
        <ul>
          {sortedComments?.map((comment, index) => (
            <li
              className='mb-4'
              key={comment.commentId}
              ref={index === sortedComments.length - 1 ? ref : null}
            >
              <div className='flex justify-between'>
                <div className='mt-2 mr-3'>
                  <ProfileImage
                    profilePathname={comment.profilePathname}
                    size='small'
                    alt={comment.nickname}
                  />
                </div>
                <div className='w-full'>
                  <div className='mb-1'>
                    <span
                      className={`mr-3 font-semibold text-base ${
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
                    {comment.votedFor ? (
                      <span className='text-sm text-gray-500'>
                        {comment.votedFor}
                        {'  -  '}
                      </span>
                    ) : null}
                    <span
                      className='text-sm text-gray-500'
                      title={dayjs(comment.createdAt).format(
                        'YYYY년 MM월 DD일 HH시 MM분'
                      )}
                    >
                      {getRelativeDate(comment.createdAt)}
                    </span>
                  </div>
                  {updateCommentId !== comment.commentId ? (
                    <ToggleableP
                      className={'text-slate-700'}
                      text={comment.text}
                      numberOfLines={3}
                    />
                  ) : (
                    <>
                      <TextArea
                        id='editText'
                        name='editText'
                        value={newText}
                        error={state.errors?.text}
                        className={`p-2 mb-1`}
                        onChange={(e) => setNewText(e.target.value)}
                        rows={2}
                      />
                      <div className='flex w-full justify-end'>
                        <div className='w-1/3 flex gap-2'>
                          <Button
                            type='button'
                            onClick={() => setUpdateCommentId(null)}
                            variant='ghost'
                          >
                            취소
                          </Button>
                          <Button
                            type='button'
                            variant='primary'
                            onClick={handleEditTextSubmit}
                          >
                            확인
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {comment.userId === userId ? (
                  <div className='relative w-10 h-10 mt-2'>
                    <button
                      type='button'
                      className={`dropdown-menu-toggle transition-colors hover:bg-primary-50 active:bg-primary-200 rounded-full w-10 h-10 flex justify-center items-center`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (comment.commentId !== dropdownMenuId) {
                          setDropdownMenuId(comment.commentId);
                        } else {
                          setDropdownMenuId(null);
                        }
                      }}
                    >
                      <EllipsisVertical size='1.2rem' />
                    </button>
                    <CommentDropdownMenu
                      openDropdownMenu={comment.commentId === dropdownMenuId}
                      onOpenDeleteCommentModal={() =>
                        setOpenDeleteConfirmModal(true)
                      }
                      startEditComment={() => {
                        setNewText(comment.text);
                        setUpdateCommentId(comment.commentId);
                        setDropdownMenuId(null);
                      }}
                    />
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : null}
      <DeleteConfirmModal
        title={'해당 댓글을 정말로 삭제하시겠습니까?'}
        description={''}
        open={!!openDeleteConfirmModal}
        onClose={() => {
          setOpenDeleteConfirmModal(false);
          setDropdownMenuId(null);
        }}
        onConfirm={handleDeleteComment}
      />
    </section>
  );
}
