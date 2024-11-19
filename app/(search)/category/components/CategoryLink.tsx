'use client';

import Link from 'next/link';
import useQueryString from '@/app/hooks/useQueryString';

interface Props {
  id: number;
  name: string;
  children: React.ReactNode;
}

export default function CategoryLink({ id, name, children }: Props) {
  const { createQueryString } = useQueryString();

  return (
    <Link href={'/search?' + createQueryString('category', name)} key={`category-${id}`} className="mt-6">
      {children}
    </Link>
  );
}
