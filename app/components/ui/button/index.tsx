interface Props {
  className?: string;
  variant: 'primary' | 'outline';
  onClick?: () => void;
  children: React.ReactNode;
}

export default function Button({
  className = '',
  variant,
  onClick,
  children,
}: Props) {
  let classNameResult = className;
  if (variant === 'primary')
    classNameResult +=
      ' bg-primary-500 hover:bg-primary-700 transition-colors text-white';
  if (variant === 'outline')
    classNameResult +=
      ' border bg-white hover:bg-gray-50 transition-colors text-slate-700';

  return (
    <button
      onClick={onClick}
      className={`w-full font-semibold py-3 px-2 rounded ${classNameResult}`}
    >
      {children}
    </button>
  );
}
