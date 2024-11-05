import Link from 'next/link';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className?: string;
  variant: 'primary' | 'outline' | 'ghost';
  onClick?: () => void;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export default function LinkButton({
  className = '',
  variant,
  onClick,
  children,
  role,
  href,
  size = 'medium',
  ...props
}: LinkProps) {
  let classNameResult = className;
  if (variant === 'primary')
    classNameResult +=
      ' bg-primary-500 hover:bg-primary-600 active:bg-primary-700  transition-colors text-white';
  if (variant === 'outline')
    classNameResult +=
      ' border bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors text-slate-700';
  if (variant === 'ghost')
    classNameResult +=
      ' bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors text-slate-700';

  if (size === 'small') classNameResult += ' py-2 px-1';
  if (size === 'medium') classNameResult += ' py-3 px-2';
  if (size === 'large') classNameResult += ' py-3 px-3 text-lg rounded-lg';

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`w-full text-center text-base font-semibold rounded ${classNameResult}`}
      {...props}
    >
      {children}
    </Link>
  );
}
