'use client';

import Link from 'next/link';
import toast from 'react-hot-toast';

interface Props {
  worldcupId: string | null;
  disabled: 'candidates' | null;
}

export default function WorldcupFormTab({ worldcupId, disabled }: Props) {
  return (
    <nav className='flex'>
      <Link
        href={`/worldcups/${worldcupId}/update-info`}
        className='px-8 py-4 font-semibold text-primary-500'
      >
        정보
      </Link>
      {disabled === 'candidates' ? (
        <div
          onClick={() => toast.error('월드컵을 먼저 만들어야 합니다.')}
          className='cursor-pointer px-8 py-4'
        >
          후보 관리
        </div>
      ) : (
        <Link
          href={`/worldcups/${worldcupId}/update-candidates`}
          className='px-8 py-4'
        >
          후보 관리
        </Link>
      )}
    </nav>
  );
}
