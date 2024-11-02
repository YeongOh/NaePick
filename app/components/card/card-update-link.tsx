'use client';

import { deleteWorldcup } from '@/app/lib/actions/worldcups/delete';
import Link from 'next/link';
import { useState } from 'react';
import DeleteConfirmModal from '../modal/delete-confirm-modal';
import toast from 'react-hot-toast';

interface Props {
  worldcupId: string;
}

export default function CardUpdateLink({ worldcupId }: Props) {
  const [showDeleteWorldcupConfirmModal, setShowDeleteWorldcupConfirmModal] =
    useState<boolean>(false);

  const handleDeleteConfirm = async () => {
    try {
      await deleteWorldcup(worldcupId);
      setShowDeleteWorldcupConfirmModal(false);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <>
      <div
        className='mt-4 flex gap-2 text-base'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className='flex-1 text-red-500'
          onClick={() => setShowDeleteWorldcupConfirmModal(true)}
        >
          삭제
        </button>
        <Link
          className='flex-1 p-2 text-primary-500 bg-gray-100 rounded text-center'
          href={`/worldcups/${worldcupId}/update-info`}
        >
          수정
        </Link>
      </div>
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
