'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  href: string;
  children: React.ReactNode;
}

export default function NavbarLink({ href, children }: Props) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`relaitve ${
        pathname.startsWith(href) && 'font-semibold text-primary-500'
      }`}
    >
      {children}
    </Link>
  );
}
