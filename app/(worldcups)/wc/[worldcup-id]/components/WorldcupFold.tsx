'use client';

import { useQuery } from '@tanstack/react-query';
import { Star, ThumbsUp } from 'lucide-react';
import toast from 'react-hot-toast';
import Avatar from '@/app/ui/Avatar';
import ExpandableText from '@/app/ui/ExpandableText';
import dayjs from '@/app/utils/dayjs';
import { getWorldcupLikes, isWorldcupFavourite } from '../actions';
import useWorldcupFavouriteMutation from '../hooks/useWorldcupFavouriteMutation';
import useWorldcupLikeMutation from '../hooks/useWorldcupLikeMutation';

interface Props {
  nickname: string | null;
  createdAt: string;
  updatedAt: string;
  description: string | null;
  profilePath: string | null;
  worldcupId: string;
  userId?: string;
}

export default function WorldcupFold({
  worldcupId,
  userId,
  nickname,
  createdAt,
  updatedAt,
  description,
  profilePath,
}: Props) {
  const { data: likesData, isLoading: likeCountLoading } = useQuery({
    queryKey: ['worldcup-likes', { worldcupId }],
    queryFn: () => getWorldcupLikes(worldcupId),
  });
  const { likeWorldcupMutation } = useWorldcupLikeMutation({ worldcupId });

  const { data: isFavourite, isLoading: isFavouriteLoading } = useQuery({
    queryKey: ['worldcup-favourites', { worldcupId }],
    queryFn: () => isWorldcupFavourite(worldcupId),
  });
  const { worldcupFavouriteMutation } = useWorldcupFavouriteMutation({ worldcupId });

  const createdDate = dayjs(createdAt);
  const updatedDate = dayjs(updatedAt);
  const isUpdated = createdDate.diff(updatedDate);

  function handleLikeWorldcup() {
    if (!userId) {
      toast.error('로그인이 필요한 서비스입니다.');
      return;
    }
    if (likeCountLoading) return;

    if (likesData?.isLiked) {
      likeWorldcupMutation.mutate({ worldcupId, like: false });
    } else {
      likeWorldcupMutation.mutate({ worldcupId, like: true });
    }
  }

  async function handleAddWorldcupFavourite() {
    if (!userId) {
      toast.error('로그인이 필요한 서비스입니다.');
      return;
    }
    if (isFavouriteLoading) return;

    let result;
    if (isFavourite) {
      result = await worldcupFavouriteMutation.mutateAsync({ worldcupId, favourite: false });
    } else {
      result = await worldcupFavouriteMutation.mutateAsync({ worldcupId, favourite: true });
    }

    if (result?.errors) {
      const errors = result.errors;
      if (errors.session && typeof errors.session === 'string') {
        toast.error(errors.session);
      } else if (errors.duplicate && typeof errors.duplicate === 'string') {
        toast.error(errors.duplicate);
      }
    } else {
      toast.success('즐겨찾기 되었습니다.');
    }
  }

  return (
    <>
      <div className="mb-1 flex items-center">
        <Avatar
          profilePath={profilePath}
          className="mr-2"
          size="md"
          alt={nickname ? nickname : '탈퇴한 회원'}
        />
        <div>
          <div className="text-base font-semibold text-slate-700">{nickname}</div>
          <div className="mb-2 text-sm text-gray-500">
            {createdDate.format('YYYY년 MM월 MM일')}{' '}
            <span title={updatedDate.format('YYYY년 MM월 MM일')}>
              {isUpdated ? `(${updatedDate.fromNow()} 업데이트)` : ``}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <ExpandableText className="w-full text-slate-700" size="md" text={description ? description : ''} />
      </div>
      <div className="flex w-full justify-center">
        <div className="flex w-1/3">
          <button
            className="flex h-10 w-2/3 items-center justify-center rounded-bl rounded-tl border bg-white px-2 py-2 text-base hover:bg-gray-100"
            aria-label="좋아요"
            type="button"
            onClick={handleLikeWorldcup}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center gap-1 ${likesData?.isLiked ? 'text-primary-500' : 'text-slate-700'}`}
            >
              {likeCountLoading ? '...' : `${likesData?.likeCount}`}
              <ThumbsUp size={'1.3rem'} />
            </div>
          </button>
          <button
            className="flex h-10 w-1/3 items-center justify-center rounded-br rounded-tr border-b border-r border-t bg-white px-2 py-2 text-slate-700 hover:bg-gray-100"
            aria-label="즐겨찾기"
            type="button"
            onClick={handleAddWorldcupFavourite}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center ${isFavourite ? 'text-yellow-500' : 'text-slate-700'}`}
            >
              <Star size={'1.3rem'} />
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
