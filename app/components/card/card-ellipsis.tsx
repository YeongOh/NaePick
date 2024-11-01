'use client';

import DropdownMenu from '../dropdown-menu/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';

interface Props {
  worldcupId: string;
  title: string;
  openDropdownMenu: boolean;
  onOpenDropdownMenu: () => void;
  onCloseDropdownMenu: () => void;
}

export default function CardEllipsis({
  worldcupId,
  openDropdownMenu,
  onOpenDropdownMenu,
  onCloseDropdownMenu,
  title,
}: Props) {
  return (
    <div className='relative'>
      <button
        type='button'
        className='menubar-toggle transition-colors hover:bg-primary-50 active:bg-primary-200 hover:border rounded-full w-10 h-10 flex justify-center items-center relative'
        onClick={() => {
          if (!openDropdownMenu) {
            onOpenDropdownMenu();
          } else {
            onCloseDropdownMenu();
          }
        }}
      >
        <EllipsisVertical size='1.2rem' />
      </button>
      <DropdownMenu
        worldcupId={worldcupId}
        openDropdownMenu={openDropdownMenu}
        title={title}
      />
    </div>
  );
}
