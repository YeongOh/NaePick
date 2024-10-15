'use client';

import { deleteUserPost } from '@/app/lib/actions/posts/delete';
import Link from 'next/link';

interface Props {
  postId: string;
  userId: string;
}

export default function CardUpdateForm({ postId, userId }: Props) {
  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!confirm('정말로 삭제하시겠습니까?')) {
      return;
    }
    deleteUserPost(postId, userId);
  };

  return (
    <div className='mt-4 flex'>
      <div className='flex h-12 w-full items-center justify-between px-4'>
        <Link
          className='p-2 bg-primary-500 text-white rounded px-4'
          href={`posts/${postId}/update`}
        >
          수정
        </Link>
        <button className='text-red-500' onClick={handleDeleteClick}>
          삭제
        </button>
      </div>
    </div>
  );
}
