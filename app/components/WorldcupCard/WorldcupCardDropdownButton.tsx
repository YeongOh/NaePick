'use client';

import { EllipsisVertical } from 'lucide-react';
import { useDropdown } from '@/app/hooks/useDropdown';
import { useWorldcupCard } from '@/app/hooks/useWorldcupCard';
import WorldcupCardDropdownMenu from './WorldcupCardDropdownMenu';

export default function WorldcupCardMenuButton() {
  const { toggleDropdown } = useDropdown();
  const { worldcupCard } = useWorldcupCard();
  const { id } = worldcupCard;

  return (
    <div className="relative">
      <button
        aria-label="작업 메뉴"
        type="button"
        className="dropdown-menu-toggle flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:border hover:bg-secondary-50 active:bg-secondary-50"
        onClick={() => toggleDropdown(id)}
      >
        <EllipsisVertical size="1.2rem" />
      </button>
      <WorldcupCardDropdownMenu />
    </div>
  );
}
