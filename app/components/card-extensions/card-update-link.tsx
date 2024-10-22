'use client';

import { deleteWorldcup } from '@/app/lib/actions/worldcups/delete';
import Link from 'next/link';

interface Props {
  worldcupId: string;
  worldcupUserId: string;
}

export default function CardUpdateLink({ worldcupId, worldcupUserId }: Props) {
  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!confirm('정말로 삭제하시겠습니까?')) {
      return;
    }
    deleteWorldcup(worldcupId, worldcupUserId);
  };

  return (
    <div className='mt-4 flex gap-2 text-base'>
      <button className='flex-1 text-red-500' onClick={handleDeleteClick}>
        삭제
      </button>
      <Link
        className='flex-1 p-2 text-primary-500 bg-gray-100 rounded text-center'
        href={`/worldcups/${worldcupId}/update-info`}
      >
        수정
      </Link>
    </div>
  );
}
