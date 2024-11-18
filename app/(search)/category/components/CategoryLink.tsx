'use client';

import { useCallback } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Props {
  id: number;
  name: string;
  children: React.ReactNode;
}

export default function CategoryLink({ id, name, children }: Props) {
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  return (
    <Link href={'/search?' + createQueryString('category', name)} key={`category-${id}`} className="mt-6">
      {children}
    </Link>
  );
}
