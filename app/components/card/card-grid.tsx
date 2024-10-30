'use client';

import { WorldcupCard } from '@/app/lib/definitions';
import Card from './card';
import { useEffect, useState } from 'react';

interface Props {
  worldcupCards: WorldcupCard[];
  extended?: boolean;
}

export default function CardGrid({ worldcupCards, extended }: Props) {
  const [dropdownMenuIndex, setDropdownMenuIndex] = useState<number | null>(
    null
  );

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.menubar') &&
      !target.closest('.menubar-toggle') &&
      !target.closest('.modal')
    ) {
      setDropdownMenuIndex(null);
    }
  };

  useEffect(() => {
    if (dropdownMenuIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup listener on component unmount
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownMenuIndex]);

  return (
    <ul className='flex flex-wrap mt-6'>
      {worldcupCards.map((worldcup, index: number) => (
        <Card
          key={worldcup.worldcupId}
          worldcupCard={worldcup}
          openDropdownMenu={dropdownMenuIndex === index}
          onOpenDropdownMenu={() => setDropdownMenuIndex(index)}
          onCloseDropdownMenu={() => setDropdownMenuIndex(null)}
          extended={extended}
        />
      ))}
    </ul>
  );
}
