import { ComponentProps } from 'react';

import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

interface Props extends ComponentProps<'button'> {
  className?: string;
  variant: 'primary' | 'outline' | 'ghost' | 'delete';
  pending?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'icon';
}

export default function Button({ className, variant, children, pending, size = 'md', ...props }: Props) {
  return (
    <button
      {...props}
      disabled={props.disabled || pending}
      className={clsx(
        'inline-flex items-center justify-center gap-1 rounded text-base font-semibold',

        size === 'sm' && 'h-9 rounded-md px-3 py-2',
        size === 'md' && 'h-10 rounded-md px-4 py-2',
        size === 'icon' && 'h-10 w-10',

        variant === 'primary' &&
          'bg-primary-500 text-white transition-colors hover:bg-primary-600 active:bg-primary-700',
        variant === 'outline' &&
          'border bg-white text-slate-700 transition-colors hover:bg-gray-50 active:bg-gray-100',
        variant === 'ghost' &&
          'bg-white text-slate-700 transition-colors hover:bg-gray-50 active:bg-gray-100',
        variant === 'delete' && 'bg-red-500 text-white transition-colors hover:bg-red-600 active:bg-red-700',

        pending && 'opacity-50',
        className,
      )}
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin" /> 처리 중입니다
        </>
      ) : (
        children
      )}
    </button>
  );
}
