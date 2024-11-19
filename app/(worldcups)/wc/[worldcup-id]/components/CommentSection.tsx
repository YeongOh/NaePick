'use client';

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
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
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
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
    formState: { errors, isSubmitting },
  } = useForm<TCommentFormSchema>({
    resolver: zodResolver(CommentFormSchema),
  });
  const comments = data?.pages.flatMap((page) => page?.data) || [];

  useEffect(() => {
    if (inView && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, hasNextPage]);

  const onCommentFormSubmit = async (data: TCommentFormSchema) => {
    await createCommentMutation.mutate({ data, worldcupId, votedCandidateId: finalWinnerCandidateId });
  };

  const handleDeleteComment = async () => {
    if (deleteConfirmId === null) return;
    deleteCommentMutation.mutate({
      commentId: deleteConfirmId.commentId,
      parentId: deleteConfirmId.parentId,
    });
    setDeleteConfirmId(null);
    toggleDropdown(null);
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
      toast.error('로그인이 필요합니다!');
      return;
    }
    likeCommentMutation.mutate({ commentId, userId, like, parentId });
  };

  return (
    <section className={`${className} bg-white`}>
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
      {isLoading || isFetchingNextPage ? (
        <div className="relative mt-10 flex items-center justify-center">
          <div className="absolute">
            <Spinner />
          </div>
        </div>
      ) : (
        <div ref={ref} />
      )}
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
