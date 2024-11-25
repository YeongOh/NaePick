import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import {
  cancelLikeCommentAction,
  createCommentAction,
  deleteCommentAction,
  likeCommentAction,
  replyCommentAction,
  updateCommentAction,
} from '../actions';
import { TCommentFormSchema, WorldcupComment } from '../types';

interface Props {
  worldcupId: string;
}

export default function useCommentMutation({ worldcupId }: Props) {
  const queryClient = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: ({
      data,
      worldcupId,
      votedCandidateId,
    }: {
      worldcupId: string;
      data: TCommentFormSchema;
      votedCandidateId?: string;
    }) => {
      return createCommentAction({
        data,
        worldcupId,
        votedCandidateId,
      });
    },
    onSuccess: (data, variables, context) => {
      if (data?.errors) {
        return data;
      }

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
      data,
      parentId,
    }: {
      commentId: string;
      data: TCommentFormSchema;
      parentId: string | null;
    }) => {
      return updateCommentAction(commentId, data);
    },
    onMutate: async ({ commentId, data, parentId }) => {
      const text = data.text.trim();
      if (parentId) {
        await queryClient.cancelQueries({ queryKey: ['replies', { parentId }] });
        const snapshot = queryClient.getQueryData(['replies', { parentId }]);
        queryClient.setQueryData(['replies', { parentId }], (old: WorldcupComment[]) =>
          old.map((comment) =>
            comment.id === commentId ? { ...comment, text, updatedAt: String(new Date()) } : comment,
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
              comment.id === commentId ? { ...comment, text, updatedAt: String(new Date()) } : comment,
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
    onSuccess: (data, variables, context) => {
      if (data?.errors) {
        return data;
      }
    },
    onError: (error, { parentId }, context) => {
      console.error(error);
      if (parentId) {
        queryClient.setQueryData(['replies', { parentId }], context?.snapshot);
      } else {
        queryClient.setQueryData(['comments', { worldcupId }], context?.snapshot);
      }
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: ({ commentId, parentId }: { commentId: string; parentId: string | null }) => {
      return deleteCommentAction(commentId);
    },
    onSuccess: (data, { parentId }) => {
      if (data?.errors) {
        return data;
      }

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
    onSuccess: (data) => {
      if (data?.errors) {
        return data;
      }
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

  const replyCommentMutation = useMutation({
    mutationFn: ({
      parentId,
      data,
      worldcupId,
      votedCandidateId,
    }: {
      data: TCommentFormSchema;
      votedCandidateId?: string;
      parentId: string;
      worldcupId: string;
    }) => {
      return replyCommentAction({
        data,
        votedCandidateId,
        parentId,
        worldcupId,
      });
    },

    onSuccess: (data, { worldcupId, parentId }) => {
      if (data?.errors) {
        return data;
      }

      queryClient.setQueryData(['comment-count', { worldcupId }], (oldCount: number) => oldCount + 1);
      queryClient.invalidateQueries({
        queryKey: ['replies', { parentId }],
      });
      queryClient.invalidateQueries({
        queryKey: ['comments', { worldcupId }],
      });
    },

    onError: (error, data, variables) => {
      console.error(error);
    },
  });

  return {
    createCommentMutation,
    updateCommentMutation,
    deleteCommentMutation,
    likeCommentMutation,
    replyCommentMutation,
  };
}
