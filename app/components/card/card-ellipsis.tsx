'use client';

import { HiEllipsisVertical } from 'react-icons/hi2';
import Menubar from '../menubar/menubar';
import { forwardRef, useEffect, useRef } from 'react';

interface Props {
  worldcupId: string;
  title: string;
  openMenubar: boolean;
  onOpenMenubar: () => void;
  onCloseMenubar: () => void;
}

export default function CardEllipsis({
  worldcupId,
  openMenubar,
  onOpenMenubar,
  onCloseMenubar,
  title,
}: Props) {
  return (
    <div className='relative'>
      <button
        type='button'
        className='menubar-toggle transition-colors hover:bg-primary-50 active:bg-primary-200 hover:border rounded-full w-[40px] h-[40px] flex justify-center items-center relative'
      >
        <HiEllipsisVertical
          className=''
          size={'1.5rem'}
          onClick={() => {
            if (!openMenubar) {
              onOpenMenubar();
            } else {
              onCloseMenubar();
            }
          }}
        />
      </button>
      <Menubar
        worldcupId={worldcupId}
        openMenubar={openMenubar}
        title={title}
      />
    </div>
  );
}
