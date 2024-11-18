'use client';

import Link from 'next/link';
import toast from 'react-hot-toast';

interface Props {
  worldcupId: string | null;
  disabled: 'candidates' | null;
  highlight: 'info' | 'candidates';
}

export default function WorldcupFormTab({ worldcupId, disabled, highlight }: Props) {
  return (
    <nav className="mt-4 flex">
      <Link
        href={`/wc/edit/${worldcupId}`}
        className={`w-[90px] py-3 text-center text-base text-gray-500 ${
          highlight == 'info' && 'rounded-tl-lg rounded-tr-lg bg-gray-50 font-semibold text-slate-700'
        }`}
      >
        정보 작성
      </Link>
      {disabled === 'candidates' ? (
        <div
          onClick={() => toast.error('월드컵을 먼저 생성해야 합니다.')}
          className="w-[90px] cursor-pointer py-3 text-center text-gray-500"
        >
          후보 추가
        </div>
      ) : (
        <Link
          href={`/wc/edit-candidates/${worldcupId}`}
          className={`w-[90px] py-3 text-center text-base text-gray-500 ${
            highlight == 'candidates' && 'rounded-tl-lg rounded-tr-lg bg-gray-50 font-semibold text-slate-700'
          }`}
        >
          후보 추가
        </Link>
      )}
    </nav>
  );
}
