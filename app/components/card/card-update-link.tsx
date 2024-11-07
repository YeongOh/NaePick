'use client';

import Link from 'next/link';
import { useState } from 'react';
import DeleteConfirmModal from '../modal/delete-confirm-modal';
import toast from 'react-hot-toast';
import { deleteWorldcup } from '@/app/lib/worldcups/service';

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
        <div className='flex justify-end items-center gap-2 w-full'>
          <button
            onClick={() => setShowDeleteWorldcupConfirmModal(true)}
            className='card-button card-link w-20 text-base font-semibold rounded  border bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors text-red-500 py-2 px-1'
          >
            삭제 하기
          </button>
          <Link
            href={`/wc/edit/${worldcupId}`}
            className='card-button text-center card-link w-20 text-base font-semibold rounded  border hover:bg-primary-600 active:bg-primary-700 transition-colors text-white bg-primary-500 py-2 px-1'
          >
            수정하기
          </Link>
        </div>
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
