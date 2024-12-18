'use client;';

import { forwardRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { ChevronDown, ChevronUp, EllipsisVertical, Heart } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDropdown } from '@/app/hooks/useDropdown';
import Avatar from '@/app/ui/Avatar';
import Button from '@/app/ui/Button';
import ExpandableText from '@/app/ui/ExpandableText';
import FormError from '@/app/ui/FormError';
import FormTextArea from '@/app/ui/FormTextArea';
import Spinner from '@/app/ui/Spinner';
import dayjs from '@/app/utils/dayjs';
import CommentDropdownMenu from './CommentDropdownMenu';
import { getCommentReplies } from '../actions';
import useCommentMutation from '../hooks/useCommentMutation';
import { CommentFormSchema, TCommentFormSchema, WorldcupComment } from '../types';

interface Props {
  comment: WorldcupComment;
  userId?: string;
  updateCommentId: string | null;
  finalWinnerCandidateId?: string;
  worldcupId: string;
  onLikeComment: (id: string, like: boolean) => void;
  onUpdateCommentToggle: (id: string) => void;
  onUpdateCommentSubmit: () => void;
  onOpenDeleteCommentModal: (id: string) => void;
}

const Comment = forwardRef<HTMLLIElement, Props>(function Comment(
  {
    comment,
    userId,
    updateCommentId,
    finalWinnerCandidateId,
    worldcupId,
    onLikeComment,
    onUpdateCommentToggle,
    onUpdateCommentSubmit,
    onOpenDeleteCommentModal,
  }: Props,
  ref,
) {
  const { dropdownId, toggleDropdown } = useDropdown();
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [fetchForNewReplyComment, setFetchForNewReplyComment] = useState(false);
  const { data: replies, isLoading: isLoadingReplies } = useQuery({
    queryKey: ['replies', { parentId: comment.id }],
    queryFn: () => getCommentReplies(comment.id, userId),
    enabled: !!showReplies || fetchForNewReplyComment,
  });
  const { updateCommentMutation, replyCommentMutation } = useCommentMutation({
    worldcupId,
  });
  const {
    getValues: getNewTextValues,
    register: registerNewText,
    handleSubmit: handleUpdateCommentSubmit,
    setValue: setNewTextValue,
    setError: setNewTextError,
    formState: { errors: newTextErrors },
  } = useForm<TCommentFormSchema>({
    resolver: zodResolver(CommentFormSchema),
    defaultValues: {
      text: comment.text,
    },
  });

  const {
    register: registerReplyText,
    handleSubmit: handleReplyCommentSubmit,
    setValue: setReplyTextValue,
    setError: setReplyTextError,
    formState: { errors: replyTextErrors },
  } = useForm<TCommentFormSchema>({
    resolver: zodResolver(CommentFormSchema),
  });

  const onSubmit = async (data: TCommentFormSchema) => {
    const result = await updateCommentMutation.mutateAsync({
      commentId: comment.id,
      parentId: comment.parentId,
      data,
    });
    if (!result?.errors) {
      onUpdateCommentSubmit();
      return;
    }

    const errors = result?.errors;
    if (!errors) return;

    if ('text' in errors && typeof errors.text === 'string') {
      setNewTextError('text', { type: 'server', message: errors.text });
    } else if ('session' in errors && typeof errors.session === 'string') {
      toast.error(errors.session);
    }
  };

  const onReplyCommentSubmit = async (data: TCommentFormSchema) => {
    const result = await replyCommentMutation.mutateAsync({
      data,
      votedCandidateId: finalWinnerCandidateId,
      parentId: comment.parentId ?? comment.id,
      worldcupId,
    });

    if (!result?.errors) {
      setFetchForNewReplyComment(true);
      setIsReplying(false);
      setReplyTextValue('text', '');
      return;
    }

    const errors = result?.errors;
    if (!errors) return;

    if ('text' in errors && typeof errors.text === 'string') {
      setReplyTextError('text', { type: 'server', message: errors.text });
    } else if ('session' in errors && typeof errors.session === 'string') {
      toast.error(errors.session);
    }
  };

  return (
    <li key={comment.id}>
      <div className="flex justify-between">
        <div className="pt-2">
          <Avatar profilePath={comment.profilePath} size="sm" alt={comment.nickname} />
        </div>
        <div className="w-full pl-2">
          <div className="mb-1">
            <span
              className={`mr-3 text-base font-semibold ${
                !comment.isAnonymous && comment.nickname ? 'text-slate-700' : 'text-gray-500'
              }`}
            >
              {comment.isAnonymous ? '익명' : comment.nickname ? comment.nickname : '탈퇴한 회원'}
            </span>
            {comment.voted ? <span className="text-sm text-gray-500">{comment.voted} - </span> : null}
            <span
              className="text-sm text-gray-500"
              title={dayjs(comment.createdAt).format('YYYY년 MM월 DD일 HH시 MM분')}
            >
              {dayjs(comment.createdAt).fromNow()}
            </span>
          </div>
          {updateCommentId === comment.id ? (
            <form onSubmit={handleUpdateCommentSubmit(onSubmit)}>
              <FormTextArea
                id="newText"
                {...registerNewText('text')}
                className={`mb-1 p-2`}
                autoFocus
                onFocus={(e) => {
                  const temp = getNewTextValues('text');
                  e.target.value = '';
                  e.target.value = temp;
                }}
                error={newTextErrors.text}
                rows={2}
              />
              <FormError error={newTextErrors.text?.message} />
              <div className="flex w-full justify-end">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    onUpdateCommentToggle(comment.id);
                    setNewTextValue('text', comment.text);
                  }}
                  variant="ghost"
                >
                  취소
                </Button>
                <Button type="submit" size="sm" variant="primary">
                  확인
                </Button>
              </div>
            </form>
          ) : null}
          {updateCommentId !== comment.id ? (
            <div>
              <ExpandableText className={'text-slate-700 lg:mb-1'} text={comment.text} size="md" />
              <div className="flex -translate-x-1.5 items-center gap-1">
                <button
                  onClick={() => {
                    onLikeComment(comment.id, !comment.isLiked);
                  }}
                  className={clsx(
                    'flex h-8 w-8 items-center justify-center',
                    comment.isLiked ? 'text-secondary-500' : 'text-slate-700',
                  )}
                  type="button"
                >
                  <Heart size="1.2rem" />
                </button>
                <span className="mr-2 text-base text-gray-500">{comment.likeCount}</span>
                <button type="button" className="text-sm text-slate-700" onClick={() => setIsReplying(true)}>
                  답글
                </button>
              </div>
            </div>
          ) : null}
          {comment.replyCount && comment.replyCount > 0 ? (
            <button
              onClick={() => {
                if (!showReplies) {
                  setFetchForNewReplyComment(false);
                }
                setShowReplies((prev) => !prev);
              }}
              className="mb-1 flex gap-1 text-base text-secondary-500 hover:text-secondary-600 active:text-secondary-700"
            >
              {showReplies ? <ChevronUp /> : <ChevronDown />} 답글 {comment.replyCount}개
            </button>
          ) : null}
          {isReplying ? (
            <form onSubmit={handleReplyCommentSubmit(onReplyCommentSubmit)}>
              <FormTextArea
                id="replyText"
                {...registerReplyText('text')}
                className={`mb-1 p-2`}
                error={replyTextErrors.text}
                rows={1}
                autoFocus
              />
              <FormError error={replyTextErrors.text?.message} />
              <div className="flex w-full justify-end">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setReplyTextValue('text', '');
                    setIsReplying(false);
                  }}
                  variant="ghost"
                >
                  취소
                </Button>
                <Button type="submit" size="sm" variant="primary">
                  확인
                </Button>
              </div>
            </form>
          ) : null}
        </div>
        {comment.userId === userId ? (
          <div className="relative mt-2 h-10 w-10">
            <button
              type="button"
              className={`dropdown-menu-toggle flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-primary-50 active:bg-primary-200`}
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown(comment.id);
              }}
            >
              <EllipsisVertical size="1.2rem" />
            </button>
            <CommentDropdownMenu
              openDropdownMenu={dropdownId === comment.id}
              onOpenDeleteCommentModal={() => onOpenDeleteCommentModal(comment.id)}
              onUpdateCommentToggle={() => onUpdateCommentToggle(comment.id)}
            />
          </div>
        ) : null}
      </div>
      {replyCommentMutation.isPending && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
      <div className="flex justify-end">
        <ul className="relative flex w-[calc(100%-2.5rem)] flex-col">
          {showReplies && replies
            ? replies?.map((reply) => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  userId={userId}
                  worldcupId={worldcupId}
                  finalWinnerCandidateId={finalWinnerCandidateId}
                  updateCommentId={updateCommentId}
                  onLikeComment={onLikeComment}
                  onUpdateCommentToggle={onUpdateCommentToggle}
                  onUpdateCommentSubmit={onUpdateCommentSubmit}
                  onOpenDeleteCommentModal={onOpenDeleteCommentModal}
                />
              ))
            : null}
          {!showReplies && fetchForNewReplyComment && !isLoadingReplies && replies && replies.length > 0 && (
            <Comment
              key={replies.at(-1)?.id}
              comment={replies[replies.length - 1]}
              userId={userId}
              worldcupId={worldcupId}
              finalWinnerCandidateId={finalWinnerCandidateId}
              updateCommentId={updateCommentId}
              onLikeComment={onLikeComment}
              onUpdateCommentToggle={onUpdateCommentToggle}
              onUpdateCommentSubmit={onUpdateCommentSubmit}
              onOpenDeleteCommentModal={onOpenDeleteCommentModal}
            />
          )}
        </ul>
      </div>
      {isLoadingReplies && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
    </li>
  );
});

export default Comment;
