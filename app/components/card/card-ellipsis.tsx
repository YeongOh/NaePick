'use client';

import { useState } from 'react';
import CardDropdownMenu from './card-dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import ShareWorldcupModal from '../modal/share-worldcup-modal';
import { useDropdown } from '../../../hooks/useDropdown';

interface Props {
  worldcupId: string;
  title: string;
}

export default function CardEllipsis({ worldcupId, title }: Props) {
  const [shareWorldcupModal, setShareWorldcupModal] = useState(false);
  const { toggleDropdown } = useDropdown();

  const handleShareWorldcupModal = () => {
    toggleDropdown(null);
    setShareWorldcupModal(true);
  };

  return (
    <>
      <div className="relative">
        <button
          type="button"
          className={`dropdown-menu-toggle flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:border hover:bg-primary-50 active:bg-primary-200`}
          onClick={(e) => {
            e.stopPropagation();
            toggleDropdown(worldcupId);
          }}
        >
          <EllipsisVertical size="1.2rem" />
        </button>
        <CardDropdownMenu
          worldcupId={worldcupId}
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
