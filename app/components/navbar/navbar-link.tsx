'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function NavbarLink({ href, children, className }: Props) {
  const pathname = usePathname();

  return (
    <Link
      className={`${className} rounded bg-white p-2 text-center text-base font-semibold transition-colors hover:bg-gray-50 active:bg-gray-100 ${
        pathname.includes(href) ? 'text-primary-500' : 'text-slate-700'
      }`}
      href={href}
    >
      {children}
    </Link>
  );
}
