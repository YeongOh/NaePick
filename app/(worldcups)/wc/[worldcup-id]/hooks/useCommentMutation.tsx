import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  cancelLikeCommentAction,
  createCommentAction,
  deleteCommentAction,
  likeCommentAction,
  updateCommentAction,
} from '../actions';
import toast from 'react-hot-toast';
import { WorldcupComment } from '../types';

interface Props {
  worldcupId: string;
  finalWinnerCandidateId?: string;
  userId?: string;
}

export default function useCommentMutation({ worldcupId, userId, finalWinnerCandidateId }: Props) {
  const queryClient = useQueryClient();

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
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(['comment-count', { worldcupId }], (oldCount: number) => oldCount + 1);
      queryClient.invalidateQueries({
        queryKey: ['comments', { worldcupId }],
      });
    },
    onError: (error, data, context) => {
      console.error(error);
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
        queryClient.setQueryData(['replies', { parentId }], (old: WorldcupComment[]) =>
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
        (previous: InfiniteData<{ data: WorldcupComment[]; nextCursor: string }>) => {
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

    onError: (error, { parentId }, context) => {
      console.error(error);
      if (parentId) {
        queryClient.setQueryData(['replies', { parentId }], context?.snapshot);
      } else {
        queryClient.setQueryData(['comments', { worldcupId }], context?.snapshot);
      }
      toast.error(error.message);
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: ({ commentId, parentId }: { commentId: string; parentId: string | null }) => {
      return deleteCommentAction(commentId);
    },
    onSuccess: (data, { parentId }) => {
      queryClient.invalidateQueries({
        queryKey: ['comments', { worldcupId }],
      });
      queryClient.invalidateQueries({
        queryKey: ['comment-count', { worldcupId }],
      });
      if (parentId) {
        queryClient.invalidateQueries({
          queryKey: ['replies', { parentId }],
        });
      }
    },
    onError: (error, data, variables) => {
      console.error(error);
      toast.error(error.message);
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
        queryClient.setQueryData(['replies', { parentId }], (replies: WorldcupComment[]) =>
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
        (previous: InfiniteData<{ data: WorldcupComment[]; nextCursor: string }>) => {
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
    onError: (error, { parentId }, context) => {
      console.error(error);
      if (parentId) {
        queryClient.setQueryData(['replies', { parentId }], context?.snapshot);
      } else {
        queryClient.setQueryData(['comments', { worldcupId }], context?.snapshot);
      }
      toast.error(error.message);
    },
  });

  return { createCommentMutation, updateCommentMutation, deleteCommentMutation, likeCommentMutation };
}
