'use client';

import { forwardRef, useState } from 'react';

import { FieldError } from 'react-hook-form';

interface InputProps {
  id: string;
  name?: string;
  type?: string;
  placeholder?: string;
  error?: string[] | FieldError;
  autoFocus?: boolean;
  value?: string;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    name,
    type = 'text',
    placeholder,
    error,
    autoFocus = false,
    value,
    onChange,
    className,
    defaultValue,
    readOnly,
    disabled,
  }: InputProps,
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
    setHasValue(!!e.target.value);
  };

  return (
    <div className="relative">
      <input
        ref={ref}
        id={id}
        name={name}
        type={type}
        className={`block w-full rounded-lg border border-gray-200 text-base text-slate-700 placeholder:text-gray-500 focus:outline-primary-500 disabled:bg-gray-100 ${error ? 'outline outline-2 outline-red-500' : ''} ${className || ''}`}
        aria-describedby={`${id}-error`}
        autoComplete="off"
        autoFocus={autoFocus}
        value={value}
        onChange={handleChange}
        defaultValue={defaultValue}
        readOnly={readOnly}
        disabled={disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <label
        htmlFor={id}
        className={`${
          error ? 'text-red-500' : 'text-gray-500'
        } absolute left-4 top-[28%] cursor-text text-base transition ${
          focused || hasValue || defaultValue || value
            ? '-translate-x-1 -translate-y-6 bg-white text-primary-500'
            : 'bg-transparent'
        }`}
      >
        {placeholder}
      </label>
    </div>
  );
});

export default Input;
