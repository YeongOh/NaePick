'use client';

import { TCard } from '@/app/lib/types';
import { forwardRef } from 'react';
import Card from './card';

interface CardGridProps {
  worldcupCards: TCard[];
  extended?: boolean;
  dropdownMenuIndex: number | null;
  onOpenDropdownMenu: (index: number | null) => void;
  onCloseDropdownMenu: (index: null) => void;
}

const CardGrid = forwardRef<HTMLLIElement, CardGridProps>(function CardGrid(
  { worldcupCards, extended, onOpenDropdownMenu, onCloseDropdownMenu, dropdownMenuIndex }: CardGridProps,
  ref
) {
  return (
    <ul className="grid grid-cols-card-12rem sm:grid-cols-card-14rem md:grid-cols-card-16rem lg:grid-cols-card-18rem justify-center gap-2 mt-4">
      {worldcupCards.map((worldcup, index: number) => (
        <Card
          ref={index === worldcupCards.length - 1 ? ref : null}
          key={worldcup.id}
          worldcupCard={worldcup}
          openDropdownMenu={dropdownMenuIndex === index}
          onOpenDropdownMenu={() => onOpenDropdownMenu(index)}
          onCloseDropdownMenu={() => onCloseDropdownMenu(null)}
          extended={extended}
        />
      ))}
    </ul>
  );
});

export default CardGrid;
