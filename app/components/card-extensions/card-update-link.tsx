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
      <div className='mt-4 flex gap-2 text-base'>
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
        onClose={() => setShowDeleteWorldcupConfirmModal(false)}
        onConfirm={handleDeleteConfirm}
      >
        정말 월드컵을 삭제하시겠습니까? <br />
        해당 월드컵은 영구히 삭제됩니다.
      </DeleteConfirmModal>
    </>
  );
}
