'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { deleteWorldcupAction } from '@/app/(worldcups)/wc/users/[user-id]/actions';
import DeleteConfirmModal from '../Modal/DeleteConfirmModal';

interface Props {
  worldcupId: string;
}

export default function CardUpdateLink({ worldcupId }: Props) {
  const [showDeleteWorldcupConfirmModal, setShowDeleteWorldcupConfirmModal] = useState<boolean>(false);

  const handleDeleteConfirm = async () => {
    try {
      await deleteWorldcupAction(worldcupId);
      setShowDeleteWorldcupConfirmModal(false);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <>
      <div className="mt-4 flex gap-2 text-base" onClick={(e) => e.stopPropagation()}>
        <div className="flex w-full items-center justify-end gap-2">
          <button
            onClick={() => setShowDeleteWorldcupConfirmModal(true)}
            className="card-button card-link w-20 rounded border bg-white px-1 py-2 text-base font-semibold text-red-500 transition-colors hover:bg-gray-50 active:bg-gray-100"
          >
            삭제 하기
          </button>
          <Link
            href={`/wc/edit/${worldcupId}`}
            className="card-button card-link w-20 rounded border bg-primary-500 px-1 py-2 text-center text-base font-semibold text-white transition-colors hover:bg-primary-600 active:bg-primary-700"
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
