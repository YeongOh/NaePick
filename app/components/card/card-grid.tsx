'use client';

import { forwardRef } from 'react';

import { TCard } from '@/app/lib/types';

import Card from './card';

interface CardGridProps {
  worldcupCards: TCard[];
  extended?: boolean;
}

const CardGrid = forwardRef<HTMLLIElement, CardGridProps>(function CardGrid(
  { worldcupCards, extended }: CardGridProps,
  ref,
) {
  return (
    <ul className="mt-4 grid grid-cols-card-12rem justify-center gap-2 sm:grid-cols-card-14rem md:grid-cols-card-16rem lg:grid-cols-card-18rem">
      {worldcupCards.map((worldcup, index: number) => (
        <Card
          ref={index === worldcupCards.length - 1 ? ref : null}
          key={worldcup.id}
          worldcupCard={worldcup}
          extended={extended}
        />
      ))}
    </ul>
  );
});

export default CardGrid;
