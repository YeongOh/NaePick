interface Props {
  className?: string;
  variant: 'primary' | 'outline' | 'ghost';
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'submit' | 'reset' | 'button' | undefined;
  role?: string;
}

export default function Button({
  className = '',
  variant,
  onClick,
  children,
  type,
  role,
}: Props) {
  let classNameResult = className;
  if (variant === 'primary')
    classNameResult +=
      ' bg-primary-500 hover:bg-primary-700 transition-colors text-white';
  if (variant === 'outline')
    classNameResult +=
      ' border bg-white hover:bg-gray-50 transition-colors text-slate-700';
  if (variant === 'ghost')
    classNameResult +=
      ' bg-white hover:bg-gray-50 transition-colors text-slate-700';

  return (
    <button
      role={role}
      type={type}
      onClick={onClick}
      className={`w-full text-base font-semibold py-3 px-2 rounded ${classNameResult}`}
    >
      {children}
    </button>
  );
}
