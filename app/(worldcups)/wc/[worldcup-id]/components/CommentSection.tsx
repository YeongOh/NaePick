'use client';

import React, { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import TextArea from '@/app/components/ui/textarea';
import InputErrorMessage from '@/app/components/ui/input-error-message';
import DeleteConfirmModal from '@/app/components/modal/delete-confirm-modal';
import {
  cancelLikeCommentAction,
  createCommentAction,
  CreateCommentState,
  deleteCommentAction,
  getComments,
  getCommentCount,
  likeCommentAction,
  replyCommentAction,
  updateCommentAction,
} from '../actions';
import { InferSelectModel } from 'drizzle-orm';
import { comments } from '@/app/lib/database/schema';
import Comment from './Comment';
import Button from '@/app/components/ui/button';
import { COMMENT_TEXT_MAX_LENGTH } from '@/app/constants';
import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Spinner from '@/app/components/ui/spinner';
import { useInView } from 'react-intersection-observer';
import { useDropdown } from '@/app/components/hooks/useDropdown';

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
  const { toggleDropdown } = useDropdown();
  const [state, setState] = useState<CreateCommentState>({ errors: {} });
  const [text, setText] = useState('');
  const [numberOfNewComments, setNumberOfNewComments] = useState(0);
  const [deleteConfirmId, setDeleteConfirmId] = useState<{
    commentId: string;
    parentId: string | null;
  } | null>(null);
  const [updateCommentId, setUpdateCommentId] = useState<string | null>(null);
  const [replyCommentId, setReplyCommentId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { data: commentCount } = useQuery({
    queryKey: ['comment-count', { worldcupId }],
    queryFn: () => getCommentCount(worldcupId),
  });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['comments', { worldcupId }],
    queryFn: ({ pageParam }) => getComments(worldcupId, userId, pageParam),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
  });
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  const comments = data?.pages.flatMap((page) => page?.data) || [];
  const totalNumberOfComments = (commentCount || 0) + numberOfNewComments;

  const createCommentMutation = useMutation({
    mutationFn: ({
      text,
      worldcupId,
      votedCandidateId,
    }: {
      worldcupId: string;
      text: string;
      votedCandidateId?: string;
    }) => {
      return createCommentAction({
        text,
        worldcupId,
        votedCandidateId,
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['comments', { worldcupId }],
      });
      if (data.errors) {
        setState({ errors: data.errors });
      } else {
        setState({ errors: {} });
        setNumberOfNewComments((prev) => prev + 1);
      }
    },
    onError: (error, data, variables) => {
      console.error(error);
      toast.error('댓글 작성에 실패했습니다.');
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({
      commentId,
      newText,
      parentId,
    }: {
      commentId: string;
      newText: string;
      parentId: string | null;
    }) => {
      return updateCommentAction(commentId, newText);
    },
    onMutate: async ({ commentId, newText, parentId }) => {
      if (parentId) {
        await queryClient.cancelQueries({ queryKey: ['replies', { parentId }] });
        const snapshot = queryClient.getQueryData(['replies', { parentId }]);
        queryClient.setQueryData(['replies', { parentId }], (old: CommentModel[]) =>
          old.map((comment) =>
            comment.id === commentId ? { ...comment, text: newText, updatedAt: String(new Date()) } : comment,
          ),
        );
        return { snapshot };
      }

      await queryClient.cancelQueries({ queryKey: ['comments', { worldcupId }] });
      const snapshot = queryClient.getQueryData(['comments', { worldcupId }]);
      queryClient.setQueryData(
        ['comments', { worldcupId }],
        (previous: InfiniteData<{ data: CommentModel[]; nextCursor: string }>) => {
          const newPages = previous.pages.map((page) => {
            const newData = page.data.map((comment: any) =>
              comment.id === commentId
                ? { ...comment, text: newText, updatedAt: String(new Date()) }
                : comment,
            );
            return { ...page, data: newData };
          });
          return {
            ...previous,
            pages: newPages,
          };
        },
      );

      return { snapshot };
    },
    onError: (error, variables, context) => {
      console.error(error);
      toast.error('댓글을 수정하지 못했습니다.');
    },
  });
  const replyCommentMutation = useMutation({
    mutationFn: ({
      parentId,
      text,
      worldcupId,
      votedCandidateId,
    }: {
      text: string;
      votedCandidateId?: string;
      parentId: string;
      worldcupId: string;
    }) => {
      return replyCommentAction({
        text,
        votedCandidateId,
        parentId,
        worldcupId,
      });
    },
    onSuccess: (data, { parentId }) => {
      queryClient.invalidateQueries({
        queryKey: ['replies', { parentId }],
      });
    },
    onError: (error, data, variables) => {
      console.error(error);
      toast.error('답글 달기에 실패했습니다.');
    },
  });
  const deleteCommentMutation = useMutation({
    mutationFn: ({ commentId, parentId }: { commentId: string; parentId: string | null }) => {
      return deleteCommentAction(commentId);
    },
    onSuccess: (data, { commentId, parentId }) => {
      if (parentId) {
        queryClient.invalidateQueries({
          queryKey: ['replies', { parentId }],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ['comments', { worldcupId }],
        });
        setNumberOfNewComments((prev) => prev - 1);
      }
    },
    onError: (error, data, variables) => {
      console.error(error);
      toast.error('댓글을 삭제하지 못했습니다.');
    },
  });
  const likeCommentMutation = useMutation({
    mutationFn: ({
      commentId,
      userId,
      like,
      parentId,
    }: {
      commentId: string;
      userId: string;
      like: boolean;
      parentId: string | null;
    }) => {
      if (like) return likeCommentAction(commentId, userId);
      return cancelLikeCommentAction(commentId, userId);
    },
    onMutate: async ({ commentId, userId, like, parentId }) => {
      if (parentId) {
        await queryClient.cancelQueries({ queryKey: ['replies', { parentId }] });
        const snapshot = queryClient.getQueryData(['replies', { parentId }]);
        queryClient.setQueryData(['replies', { parentId }], (replies: CommentModel[]) =>
          replies.map((comment: any) =>
            comment.id === commentId
              ? {
                  ...comment,
                  likeCount: like ? comment.likeCount + 1 : comment.likeCount - 1,
                  isLiked: like ? true : false,
                }
              : comment,
          ),
        );
        return { snapshot };
      }

      await queryClient.cancelQueries({ queryKey: ['comments', { worldcupId }] });
      const snapshot = queryClient.getQueryData(['comments', { worldcupId }]);
      queryClient.setQueryData(
        ['comments', { worldcupId }],
        (previous: InfiniteData<{ data: CommentModel[]; nextCursor: string }>) => {
          console.log(previous);
          const newPages = previous?.pages.map((page) => {
            const newData = page.data.map((comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    likeCount: like ? comment.likeCount + 1 : comment.likeCount - 1,
                    isLiked: like ? true : false,
                  }
                : comment,
            );
            return { ...page, data: newData };
          });
          return {
            ...previous,
            pages: newPages,
          };
        },
      );

      return { snapshot };
    },
    onError: (error, data, variables) => {
      console.error(error);
    },
  });

  useEffect(() => {
    if (inView && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, hasNextPage]);

  const handleCommentFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    if (newText.length <= 0) {
      toast.error('최소 0자 이상이어야 합니다.');
      return;
    }
    if (newText.length > COMMENT_TEXT_MAX_LENGTH) {
      toast.error(`최소 ${COMMENT_TEXT_MAX_LENGTH}자 이하여야 합니다.`);
      return;
    }

    updateCommentMutation.mutate({ commentId: id, newText, parentId });
    setUpdateCommentId(null);
  };

  const handleReplyCommentSubmit = async (parentId: string, replyText: string) => {
    if (replyText.length <= 0) {
      toast.error('최소 0자 이상이어야 합니다.');
      return;
    }
    if (replyText.length > COMMENT_TEXT_MAX_LENGTH) {
      toast.error(`최소 ${COMMENT_TEXT_MAX_LENGTH}자 이하여야 합니다.`);
      return;
    }

    replyCommentMutation.mutate({
      text: replyText,
      votedCandidateId: finalWinnerCandidateId,
      parentId,
      worldcupId,
    });
    setReplyCommentId(null);
  };

  const handleLikeComment = async (commentId: string, like: boolean, parentId: string | null) => {
    if (!userId) {
      toast.error('로그인이 필요합니다!');
      return;
    }
    likeCommentMutation.mutate({ commentId, userId, like, parentId });
  };

  const handleReplyCommentToggle = (id: string | null) => {
    if (id === null) {
      setReplyCommentId(null);
      return;
    }
    setReplyCommentId((prev) => (prev === id ? null : id));
  };

  return (
    <section className={`${className} bg-white`}>
      <div className="my-4 text-base font-semibold text-slate-700">
        {totalNumberOfComments > 0 ? `댓글 ${totalNumberOfComments}개` : `댓글을 남겨주세요.`}
      </div>
      <form onSubmit={handleCommentFormSubmit}>
        <TextArea
          id="text"
          name="text"
          value={text}
          error={state.errors?.text}
          className={`mb-1 p-2`}
          onChange={(e) => setText(e.target.value)}
          placeholder="댓글 내용"
          rows={2}
        />
        <InputErrorMessage className="mb-1" errors={state.errors?.text} />
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
              replyingId={replyCommentId}
              onLikeComment={(id, like) => handleLikeComment(id, like, id === comment.id ? null : comment.id)}
              onUpdateCommentToggle={(id) => handleUpdateCommentToggle(id)}
              onUpdateCommentSubmit={(id, newText) =>
                handleUpdateCommentSubmit(id, newText, id === comment.id ? null : comment.id)
              }
              onReplyCommentToggle={(id) => handleReplyCommentToggle(id)}
              onReplyCommentSubmit={(replyText) => handleReplyCommentSubmit(comment.id, replyText)}
              onOpenDeleteCommentModal={(id) =>
                handleDeleteCommentModal({ commentId: id, parentId: id === comment.id ? null : comment.id })
              }
            />
          ))}
        </ul>
      ) : null}
      {isFetching || isFetchingNextPage ? (
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
