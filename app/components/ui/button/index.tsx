interface Props {
  className?: string;
  variant: 'primary' | 'outline' | 'ghost';
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'submit' | 'reset' | 'button' | undefined;
  role?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function Button({
  className = '',
  variant,
  onClick,
  children,
  type,
  role,
  size = 'medium',
}: Props) {
  let classNameResult = className;
  if (variant === 'primary')
    classNameResult +=
      ' bg-primary-500 hover:bg-primary-700 active:bg-primary-800 transition-colors text-white';
  if (variant === 'outline')
    classNameResult +=
      ' border bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors text-slate-700';
  if (variant === 'ghost')
    classNameResult +=
      ' bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors text-slate-700';

  if (size === 'small') classNameResult += ' py-2 px-1';
  if (size === 'medium') classNameResult += ' py-3 px-2';

  return (
    <button
      role={role}
      type={type}
      onClick={onClick}
      className={`w-full text-base font-semibold rounded ${classNameResult}`}
    >
      {children}
    </button>
  );
}
