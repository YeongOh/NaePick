'use client';

import { HiEllipsisVertical } from 'react-icons/hi2';
import DropdownMenu from '../dropdown-menu';

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
        className='menubar-toggle transition-colors hover:bg-primary-50 active:bg-primary-200 hover:border rounded-full w-[40px] h-[40px] flex justify-center items-center relative'
      >
        <HiEllipsisVertical
          className=''
          size={'1.5rem'}
          onClick={() => {
            if (!openDropdownMenu) {
              onOpenDropdownMenu();
            } else {
              onCloseDropdownMenu();
            }
          }}
        />
      </button>
      <DropdownMenu
        worldcupId={worldcupId}
        openDropdownMenu={openDropdownMenu}
        title={title}
      />
    </div>
  );
}
