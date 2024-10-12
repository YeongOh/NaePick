'use client';

import { deleteUserPost } from '@/app/lib/actions/posts/delete';
import Link from 'next/link';

interface Props {
  postId: string;
  userId: string;
}

export default function CardForm({ postId, userId }: Props) {
  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteUserPost(postId, userId);
  };

  return (
    <div className='mt-4 flex'>
      <div className='flex h-12 w-full gap-4'>
        <button onClick={handleDeleteClick}>삭제</button>
        <Link href={`posts/${postId}/update`}>수정</Link>
      </div>
    </div>
  );
}
