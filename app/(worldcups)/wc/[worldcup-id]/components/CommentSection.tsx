'use client';

import React, { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import TextArea from '@/app/components/ui/textarea';
import InputErrorMessage from '@/app/components/ui/input-error-message';
import DeleteConfirmModal from '@/app/components/modal/delete-confirm-modal';
import { getComments, getCommentCount } from '../actions';
import { InferSelectModel } from 'drizzle-orm';
import { comments } from '@/app/lib/database/schema';
import Comment from './Comment';
import Button from '@/app/components/ui/button';
import { COMMENT_TEXT_MAX_LENGTH } from '@/app/constants';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import Spinner from '@/app/components/ui/spinner';
import { useInView } from 'react-intersection-observer';
import { useDropdown } from '@/hooks/useDropdown';
import useCommentMutation from '../hooks/useCommentMutation';

export type CommentModel = InferSelectModel<typeof comments> & {
  nickname: string | null;
  profilePath: string | null;
  voted: string | null;
  likeCount: number;
  replyCount?: number;
  isLiked?: string | null;
};

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
  const { createCommentMutation, updateCommentMutation, deleteCommentMutation, likeCommentMutation } =
    useCommentMutation({
      worldcupId,
    });
  const { toggleDropdown } = useDropdown();
  const [text, setText] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<{
    commentId: string;
    parentId: string | null;
  } | null>(null);
  const [updateCommentId, setUpdateCommentId] = useState<string | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  const comments = data?.pages.flatMap((page) => page?.data) || [];

  useEffect(() => {
    if (inView && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, hasNextPage]);

  const handleCommentFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim().length <= 0) {
      toast.error('최소 0자 이상이어야 합니다.');
      return;
    }
    if (text.trim().length > COMMENT_TEXT_MAX_LENGTH) {
      toast.error(`최소 ${COMMENT_TEXT_MAX_LENGTH}자 이하여야 합니다.`);
      return;
    }

    createCommentMutation.mutate({ text, worldcupId, votedCandidateId: finalWinnerCandidateId });
    setText('');
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

  const handleUpdateCommentSubmit = async (id: string, newText: string, parentId: string | null) => {
    if (newText.trim().length <= 0) {
      toast.error('최소 0자 이상이어야 합니다.');
      return;
    }
    if (newText.trim().length > COMMENT_TEXT_MAX_LENGTH) {
      toast.error(`최소 ${COMMENT_TEXT_MAX_LENGTH}자 이하여야 합니다.`);
      return;
    }

    updateCommentMutation.mutate({ commentId: id, newText, parentId });
    setUpdateCommentId(null);
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
      <form onSubmit={handleCommentFormSubmit}>
        <TextArea
          id="text"
          name="text"
          value={text}
          error={createCommentMutation.isError}
          className={`mb-1 p-2`}
          onChange={(e) => setText(e.target.value)}
          placeholder="댓글 내용"
          rows={2}
        />
        <InputErrorMessage
          className="mb-1"
          errors={createCommentMutation.error?.message ? [createCommentMutation.error?.message] : undefined}
        />
        <Button
          variant="primary"
          className="mb-4 mt-1 flex items-center justify-center gap-1 text-sm lg:text-base"
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
              onUpdateCommentSubmit={(id, newText) =>
                handleUpdateCommentSubmit(id, newText, id === comment.id ? null : comment.id)
              }
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
