'use client';

import { useState } from 'react';

interface InputProps {
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string[];
  autoFocus?: boolean;
  value?: string;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  readOnly?: boolean;
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
  defaultValue,
  readOnly,
  disabled,
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
    setHasValue(!!e.target.value); // Update hasValue based on input's content
  };

  return (
    <div className='relative'>
      <input
        id={id}
        name={name}
        type={type}
        className={`text-base block w-full rounded-lg border border-gray-200 placeholder:text-gray-500 focus:outline-primary-500 text-slate-700
        ${error ? 'outline outline-2 outline-red-500' : ''} ${className}`}
        aria-describedby={`${id}-error`}
        autoComplete='off'
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
        } absolute top-[28%] left-4 text-base bg-white transition cursor-text ${
          focused || hasValue || defaultValue || value
            ? '-translate-y-6 -translate-x-1 text-primary-500'
            : ''
        }`}
      >
        {placeholder}
      </label>
    </div>
  );
}
