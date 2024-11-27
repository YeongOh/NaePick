import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { addWorldcupFavouriteAction, removeWorldcupFavouriteAction } from '../actions';

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
      queryClient.setQueryData(['worldcup-favourites', { worldcupId }], (previous: boolean) => {
        if (favourite) {
          return true;
        } else {
          return false;
        }
      });
    },
    onSuccess: (data) => {
      if (data?.errors) {
        return data;
      }
    },
    onError: (error, variables, context) => {
      console.error(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['worldcup-favourites', { worldcupId }] });
      queryClient.invalidateQueries({ queryKey: ['my-worldcup-favourites'] });
    },
  });

  return { worldcupFavouriteMutation };
}
