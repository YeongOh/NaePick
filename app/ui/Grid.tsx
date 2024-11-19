import clsx from 'clsx';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

export default function Grid({ children, className }: Props) {
  return (
    <ul
      className={clsx(
        'grid grid-cols-card-12rem justify-center gap-2 sm:grid-cols-card-14rem md:grid-cols-card-16rem lg:grid-cols-card-18rem',
        className,
      )}
    >
      {children}
    </ul>
  );
}
