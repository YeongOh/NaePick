interface Props {
  className?: string;
  variant: 'primary' | 'outline' | 'ghost';
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'submit' | 'reset' | 'button' | undefined;
  role?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export default function OldButton({
  className = '',
  variant,
  onClick,
  children,
  type,
  role,
  disabled,
  size = 'medium',
}: Props) {
  let classNameResult = '';
  if (variant === 'primary')
    classNameResult +=
      ' bg-primary-500 hover:bg-primary-600 active:bg-primary-700 transition-colors text-white';
  if (variant === 'outline')
    classNameResult +=
      ' border bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors text-slate-700';
  if (variant === 'ghost')
    classNameResult += ' bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors text-slate-700';

  if (size === 'small') classNameResult += ' py-2 px-1';
  if (size === 'medium') classNameResult += ' py-3 px-2';

  return (
    <button
      role={role}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`w-full rounded text-base font-semibold disabled:bg-gray-500 ${classNameResult} ${className}`}
    >
      {children}
    </button>
  );
}
