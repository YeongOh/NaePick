import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { likeWorldcupAction, unlikeWorldcupAction } from '../actions';

interface Props {
  worldcupId: string;
}

export default function useWorldcupLikeMutation({ worldcupId }: Props) {
  const queryClient = useQueryClient();

  const likeWorldcupMutation = useMutation({
    mutationFn: ({ worldcupId, like }: { worldcupId: string; like: boolean }) => {
      if (like) return likeWorldcupAction(worldcupId);
      return unlikeWorldcupAction(worldcupId);
    },
    onMutate: async ({ worldcupId, like }) => {
      await queryClient.cancelQueries({ queryKey: ['worldcup-likes', { worldcupId }] });
      const snapshot = queryClient.getQueryData(['worldcup-likes', { worldcupId }]);
      queryClient.setQueryData(
        ['worldcup-likes', { worldcupId }],
        (previous: { isLiked: string | boolean; likeCount: number }) => {
          if (like) {
            return {
              isLiked: true,
              likeCount: previous.likeCount + 1,
            };
          } else {
            return {
              isLiked: false,
              likeCount: previous.likeCount - 1,
            };
          }
        },
      );
      return { snapshot };
    },
    onError: (error, { worldcupId }, context) => {
      console.error(error);
      queryClient.setQueryData(['worldcup-likes', { worldcupId }], context?.snapshot);
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['worldcup-likes', { worldcupId }] });
    },
  });

  return { likeWorldcupMutation };
}
