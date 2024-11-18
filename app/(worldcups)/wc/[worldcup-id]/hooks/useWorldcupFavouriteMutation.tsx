import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addWorldcupFavouriteAction, removeWorldcupFavouriteAction } from '../actions';
import toast from 'react-hot-toast';

interface Props {
  worldcupId: string;
}

export default function useWorldcupFavouriteMutation({ worldcupId }: Props) {
  const queryClient = useQueryClient();

  const worldcupFavouriteMutation = useMutation({
    mutationFn: ({ worldcupId, favourite }: { worldcupId: string; favourite: boolean }) => {
      if (favourite) return addWorldcupFavouriteAction(worldcupId);
      return removeWorldcupFavouriteAction(worldcupId);
    },
    onMutate: async ({ worldcupId, favourite }) => {
      await queryClient.cancelQueries({ queryKey: ['worldcup-favourites', { worldcupId }] });
      const snapshot = queryClient.getQueryData(['worldcup-favourites', { worldcupId }]);
      queryClient.setQueryData(['worldcup-favourites', { worldcupId }], (previous: boolean) => {
        if (favourite) {
          return true;
        } else {
          return false;
        }
      });
      return { snapshot };
    },
    onError: (error, { worldcupId }, context) => {
      console.error(error);
      queryClient.setQueryData(['worldcup-favourites', { worldcupId }], context?.snapshot);
      toast.error(error.message);
    },
  });

  return { worldcupFavouriteMutation };
}
