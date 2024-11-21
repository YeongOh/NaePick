import clsx from 'clsx';
import Link from 'next/link';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className?: string;
  variant: 'primary' | 'outline' | 'ghost' | 'delete';
  pending?: boolean;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'icon';
}

export default function LinkButton({
  className = '',
  variant,
  children,
  role,
  href,
  size = 'md',
  ...props
}: Props) {
  return (
    <Link
      {...props}
      href={href}
      className={clsx(
        'inline-flex items-center justify-center gap-1 rounded text-base font-semibold',

        size === 'sm' && 'h-9 rounded-md px-3 py-2',
        size === 'md' && 'h-10 rounded-md px-4 py-2',
        size === 'icon' && 'h-10 w-10',

        variant === 'primary' &&
          'bg-primary-500 text-white transition-colors hover:bg-primary-600 active:bg-primary-700',
        variant === 'outline' &&
          'border bg-white text-slate-700 transition-colors hover:bg-gray-50 active:bg-gray-100',
        variant === 'ghost' && 'text-slate-700 transition-colors hover:bg-gray-50 active:bg-gray-100',
        variant === 'delete' &&
          'border bg-red-500 text-white transition-colors hover:bg-red-600 active:bg-red-700',

        className,
      )}
    >
      {children}
    </Link>
  );
}
