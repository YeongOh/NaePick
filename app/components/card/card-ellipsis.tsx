'use client';

import { HiEllipsisVertical } from 'react-icons/hi2';
import Menubar from '../menubar/menubar';
import { useState } from 'react';

interface Props {
  worldcupId: string;
  title: string;
}

export default function CardEllipsis({ worldcupId, title }: Props) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className='relative'>
      <button
        type='button'
        className='transition-colors hover:bg-primary-300 hover:border rounded-full w-[40px] h-[40px] flex justify-center items-center relative'
      >
        <HiEllipsisVertical
          className=''
          size={'1.5rem'}
          onClick={() => setShowMenu((prev) => !prev)}
        />
      </button>
      <Menubar worldcupId={worldcupId} open={showMenu} title={title} />
    </div>
  );
}
