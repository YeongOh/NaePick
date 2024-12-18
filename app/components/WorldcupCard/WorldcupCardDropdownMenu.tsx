'use client';

import { useState } from 'react';
import { ChartNoAxesColumnDecreasing, Settings, Share, Star, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import useWorldcupFavouriteMutation from '@/app/(worldcups)/wc/[worldcup-id]/hooks/useWorldcupFavouriteMutation';
import { deleteWorldcupAction } from '@/app/(worldcups)/wc/users/[user-id]/actions';
import { useDropdown } from '@/app/hooks/useDropdown';
import { useWorldcupCard } from '@/app/hooks/useWorldcupCard';
import DeleteConfirmModal from '../Modal/DeleteConfirmModal';
import ShareWorldcupModal from '../Modal/ShareWorldcupModal';

export default function WorldcupCardDropdownMenu() {
  const [showDeleteWorldcupConfirmModal, setShowDeleteWorldcupConfirmModal] = useState<boolean>(false);
  const [showShareWorldcupModal, setShowShareWorldcupModal] = useState(false);
  const { dropdownId, toggleDropdown } = useDropdown();
  const { worldcupCard, type } = useWorldcupCard();
  const { id, title } = worldcupCard;
  const open = dropdownId === id;
  const { worldcupFavouriteMutation } = useWorldcupFavouriteMutation({ worldcupId: id });

  const handleDeleteConfirm = async () => {
    try {
      await deleteWorldcupAction(id);
      setShowDeleteWorldcupConfirmModal(false);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleAddWorldcupFavourite = async () => {
    toggleDropdown(dropdownId);
    const result = await worldcupFavouriteMutation.mutateAsync({ worldcupId: id, favourite: true });
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
  };

  const handleRemoveWorldcupFavourite = async () => {
    toggleDropdown(dropdownId);
    const result = await worldcupFavouriteMutation.mutateAsync({ worldcupId: id, favourite: false });
    if (result?.errors) {
      const errors = result.errors;
      if (errors.session && typeof errors.session === 'string') {
        toast.error(errors.session);
      } else if (errors.duplicate && typeof errors.duplicate === 'string') {
        toast.error(errors.duplicate);
      }
    } else {
      toast.success('즐겨찾기 취소되었습니다.');
    }
  };

  return (
    <>
      {open && (
        <ul className="dropdown-menu absolute right-0 z-50 flex w-36 cursor-pointer flex-col rounded-lg border bg-white p-2 text-left text-base text-slate-700 shadow">
          <Link
            className="dropdown-button my-0.5 flex items-center gap-2 rounded p-2 hover:bg-secondary-50 active:bg-secondary-100"
            href={`/wc/${id}/stats`}
            onClick={() => toggleDropdown(dropdownId)}
          >
            <ChartNoAxesColumnDecreasing size="1.2rem" />
            랭킹 보기
          </Link>
          {type !== 'favourite' && (
            <button
              className="dropdown-button flex items-center gap-2 rounded p-2 text-left hover:bg-secondary-50 active:bg-secondary-100"
              onClick={handleAddWorldcupFavourite}
            >
              <Star size="1.2rem" />
              즐겨찾기
            </button>
          )}
          {type === 'favourite' && (
            <>
              <button
                className="dropdown-button my-0.5 flex items-center gap-2 rounded p-2 text-gray-500 hover:bg-secondary-50 active:bg-secondary-100"
                onClick={handleRemoveWorldcupFavourite}
              >
                <Star size="1.2rem" />
                즐겨찾기 취소
              </button>
            </>
          )}
          <button
            className="dropdown-button flex items-center gap-2 rounded p-2 text-left hover:bg-secondary-50 active:bg-secondary-100"
            onClick={() => {
              setShowShareWorldcupModal(true);
              toggleDropdown(dropdownId);
            }}
          >
            <Share size="1.2rem" />
            공유
          </button>
          {type === 'update' && (
            <>
              <Link
                className="dropdown-button my-0.5 flex items-center gap-2 rounded p-2 text-primary-700 hover:bg-secondary-50 active:bg-secondary-100"
                href={`/wc/edit/${id}`}
              >
                <Settings size="1.2rem" />
                수정하기
              </Link>
              <button
                onClick={() => {
                  setShowDeleteWorldcupConfirmModal(true);
                  toggleDropdown(dropdownId);
                }}
                className="dropdown-button my-0.5 flex items-center gap-2 rounded p-2 text-red-500 hover:bg-secondary-50 active:bg-secondary-100"
              >
                <Trash2 size="1.2rem" />
                삭제하기
              </button>
            </>
          )}
        </ul>
      )}
      <ShareWorldcupModal
        open={showShareWorldcupModal}
        onClose={() => setShowShareWorldcupModal(false)}
        worldcupId={id}
        title={title}
      />
      <DeleteConfirmModal
        open={showDeleteWorldcupConfirmModal}
        title={'해당 월드컵을 정말로 삭제하시겠습니까?'}
        description={'모든 데이터가 영구히 삭제되며 복원할 수 없습니다.'}
        onClose={() => setShowDeleteWorldcupConfirmModal(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
