'use client';

import { useState } from 'react';
import CardDropdownMenu from './card-dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import ShareWorldcupModal from '../modal/share-worldcup-modal';

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
  const [shareWorldcupModal, setShareWorldcupModal] = useState(false);

  const handleShareWorldcupModal = () => {
    setShareWorldcupModal(true);
    onCloseDropdownMenu();
  };

  return (
    <>
      <div className='relative'>
        <button
          type='button'
          className={`dropdown-menu-toggle transition-colors hover:bg-primary-50 active:bg-primary-200 hover:border rounded-full w-10 h-10 flex justify-center items-center`}
          onClick={(e) => {
            e.stopPropagation();
            if (!openDropdownMenu) {
              onOpenDropdownMenu();
            } else {
              onCloseDropdownMenu();
            }
          }}
        >
          <EllipsisVertical size='1.2rem' />
        </button>
        <CardDropdownMenu
          worldcupId={worldcupId}
          openDropdownMenu={openDropdownMenu}
          onOpenShareWorldcupModal={handleShareWorldcupModal}
          title={title}
        />
      </div>
      {shareWorldcupModal && (
        <ShareWorldcupModal
          open={shareWorldcupModal}
          onClose={() => setShareWorldcupModal(false)}
          worldcupId={worldcupId}
          title={title}
        />
      )}
    </>
  );
}
