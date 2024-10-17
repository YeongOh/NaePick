'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  href: string;
  pathToHighlight?: string;
  children: React.ReactNode;
}

export default function NavbarLink({ href, pathToHighlight, children }: Props) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`relaitve ${
        pathname.startsWith(pathToHighlight || '') &&
        'font-semibold text-primary-500'
      }`}
    >
      {children}
    </Link>
  );
}
