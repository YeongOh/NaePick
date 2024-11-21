import clsx from 'clsx';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

export default function Grid({ children, className }: Props) {
  return (
    <ul
      className={clsx(
        'grid-cols-card sm:grid-cols-card-sm md:grid-cols-card-md grid justify-center gap-x-2 gap-y-8 md:gap-y-14 lg:gap-x-3 lg:gap-y-20',
        className,
      )}
    >
      {children}
    </ul>
  );
}
