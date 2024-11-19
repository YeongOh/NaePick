import clsx from 'clsx';
import { Info } from 'lucide-react';

interface Props {
  className?: string;
  error?: string;
}

export default function FormError({ error, className }: Props) {
  if (!error) {
    return null;
  }

  return (
    <p
      aria-live="polite"
      aria-atomic="true"
      className={clsx('flex items-center gap-1 text-base text-red-500', className)}
    >
      <Info color="#ef4444" size="1.2rem" />
      {error}
    </p>
  );
}
