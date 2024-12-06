'use client';

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Pencil } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';
import DeleteConfirmModal from '@/app/components/Modal/DeleteConfirmModal';
import { useDropdown } from '@/app/hooks/useDropdown';
import Button from '@/app/ui/Button';
import FormError from '@/app/ui/FormError';
import FormTextArea from '@/app/ui/FormTextArea';
import Spinner from '@/app/ui/Spinner';
import Comment from './Comment';
import { getComments, getCommentCount } from '../actions';
import useCommentMutation from '../hooks/useCommentMutation';
import { CommentFormSchema, TCommentFormSchema } from '../types';

interface Props {
  worldcupId: string;
  className?: string;
  finalWinnerCandidateId?: string;
  userId?: string;
}

export default function CommentSection({ worldcupId, className, userId, finalWinnerCandidateId }: Props) {
  const { data: commentCount, isLoading: commentCountLoading } = useQuery({
    queryKey: ['comment-count', { worldcupId }],
    queryFn: () => getCommentCount(worldcupId),
  });
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['comments', { worldcupId }],
    queryFn: ({ pageParam }) => getComments(worldcupId, userId, pageParam),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
  });
  const { createCommentMutation, deleteCommentMutation, likeCommentMutation } = useCommentMutation({
    worldcupId,
  });
  const { toggleDropdown } = useDropdown();
  const [deleteConfirmId, setDeleteConfirmId] = useState<{
    commentId: string;
    parentId: string | null;
  } | null>(null);
  const [updateCommentId, setUpdateCommentId] = useState<string | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TCommentFormSchema>({
    resolver: zodResolver(CommentFormSchema),
  });
  const comments = data?.pages.flatMap((page) => page?.data) || [];

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const onCommentFormSubmit = async (data: TCommentFormSchema) => {
    const result = await createCommentMutation.mutateAsync({
      data,
      worldcupId,
      votedCandidateId: finalWinnerCandidateId,
    });
    const errors = result?.errors;
    if (!errors) {
      reset();
      return;
    }

    if ('text' in errors && typeof errors.text === 'string') {
      setError('text', { type: 'server', message: errors.text });
    } else if ('session' in errors && typeof errors.session === 'string') {
      toast.error(errors.session);
    }
  };

  const handleDeleteComment = async () => {
    if (deleteConfirmId === null) return;

    const result = await deleteCommentMutation.mutateAsync({
      commentId: deleteConfirmId.commentId,
      parentId: deleteConfirmId.parentId,
    });
    if (result?.errors) {
      const errors = result?.errors;
      if (errors) {
        if ('session' in errors && typeof errors.session === 'string') {
          toast.error(errors.session);
        }
      }
    } else {
      setDeleteConfirmId(null);
      toggleDropdown(null);
    }
  };

  const handleDeleteCommentModal = ({
    commentId,
    parentId,
  }: {
    commentId: string;
    parentId: string | null;
  }) => {
    setDeleteConfirmId({ commentId, parentId });
  };

  const handleUpdateCommentToggle = (id: string) => {
    if (id === updateCommentId) {
      setUpdateCommentId(null);
    } else {
      toggleDropdown(null);
      setUpdateCommentId(id);
    }
  };

  const handleLikeComment = async (commentId: string, like: boolean, parentId: string | null) => {
    if (!userId) {
      toast.error('로그인이 필요한 기능입니다.');
      return;
    }
    const result = await likeCommentMutation.mutateAsync({ commentId, userId, like, parentId });
    if (result?.errors) {
      const errors = result?.errors;
      if (errors) {
        if ('session' in errors && typeof errors.session === 'string') {
          toast.error(errors.session);
        }
      }
    }
  };

  return (
    <section className={clsx('bg-white', className)}>
      <div className="my-4 text-base font-semibold text-slate-700">
        {commentCountLoading
          ? '...'
          : commentCount && commentCount > 0
            ? `댓글 ${commentCount}개`
            : `댓글을 남겨주세요.`}
      </div>
      <form onSubmit={handleSubmit(onCommentFormSubmit)}>
        <FormTextArea
          id="text"
          {...register('text')}
          error={errors?.text}
          className={`mb-1 p-2`}
          placeholder="댓글 내용"
          rows={2}
        />
        <FormError className="mb-1" error={errors.text?.message || createCommentMutation.error?.message} />
        <Button
          className="mb-4 mt-1 flex w-full items-center justify-center gap-1 text-sm lg:text-base"
          variant="primary"
          size="md"
          pending={isSubmitting}
        >
          <Pencil color="#FFFFFF" size="1.2rem" />
          댓글 추가하기
        </Button>
      </form>
      {createCommentMutation.isPending ? (
        <div className="relative flex items-center justify-center">
          <Spinner />
        </div>
      ) : null}
      {comments.length ? (
        <ul>
          {comments?.map((comment, index) => (
            <Comment
              key={comment.id}
              comment={comment}
              userId={userId}
              updateCommentId={updateCommentId}
              worldcupId={worldcupId}
              finalWinnerCandidateId={finalWinnerCandidateId}
              onLikeComment={(id, like) => handleLikeComment(id, like, id === comment.id ? null : comment.id)}
              onUpdateCommentToggle={(id) => handleUpdateCommentToggle(id)}
              onUpdateCommentSubmit={() => setUpdateCommentId(null)}
              onOpenDeleteCommentModal={(id) =>
                handleDeleteCommentModal({ commentId: id, parentId: id === comment.id ? null : comment.id })
              }
            />
          ))}
        </ul>
      ) : null}
      {isFetchingNextPage ? <Spinner /> : <div ref={ref}></div>}
      <DeleteConfirmModal
        title={'해당 댓글을 정말로 삭제하시겠습니까?'}
        description={''}
        open={deleteConfirmId !== null}
        onClose={() => {
          setDeleteConfirmId(null);
          toggleDropdown(null);
        }}
        onConfirm={handleDeleteComment}
      />
    </section>
  );
}
