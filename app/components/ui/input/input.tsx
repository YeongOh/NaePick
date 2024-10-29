interface InputProps {
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string[];
  autoFocus?: boolean;
  value?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  id,
  name,
  type = 'text',
  placeholder,
  error,
  autoFocus = false,
  value,
  onChange,
  className,
}: InputProps) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      className={`text-base block w-full rounded-lg border border-gray-200 placeholder:text-gray-500 focus:outline-primary-500 
        ${error ? 'outline outline-2 outline-red-500' : ''} ${className}`}
      placeholder={placeholder}
      aria-describedby={`${id}-error`}
      autoComplete='off'
      autoFocus={autoFocus}
      value={value}
      onChange={onChange}
    />
  );
}
