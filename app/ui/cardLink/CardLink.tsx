'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Props {
  postId: string;
  availableRounds: number[];
  title: string;
}

export default function CardLink({ postId, availableRounds, title }: Props) {
  const maxRound = availableRounds.at(-1)!;
  const [round, setRound] = useState<number>(maxRound);

  const handleRoundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const targetRound = Number(e.target.value);
    setRound(targetRound);
  };

  return (
    <div className='mt-4 flex'>
      <div className='flex h-12 w-full gap-4'>
        <select
          id={`${title} round`}
          name='round'
          className={`h-full flex-1 peer block cursor-pointer rounded-md border border-gray-200 p-2 outline-2 focus:outline-teal-500 mb-4`}
          defaultValue={round}
          onChange={handleRoundChange}
        >
          {availableRounds.map((round) => (
            <option key={round} value={round}>
              {`${round}강`}
            </option>
          ))}
        </select>
        <Link
          href={`/posts/${postId}/${round}`}
          className='w-24 flex-1 flex items-center justify-center bg-teal-400 hover:bg-teal-500 font-semibold text-white rounded-md border'
        >
          시작
        </Link>
      </div>
    </div>
  );
}
