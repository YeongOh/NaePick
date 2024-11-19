'use client';

import { ComponentPropsWithRef, forwardRef, useState } from 'react';

import clsx from 'clsx';
import { FieldError } from 'react-hook-form';

interface Props extends ComponentPropsWithRef<'textarea'> {
  error?: FieldError | undefined;
}

const FormTextArea = forwardRef<HTMLTextAreaElement, Props>(function FormInput(
  {
    id,
    error,
    onChange,
    onBlur,
    autoComplete = 'off',
    defaultValue,
    value,
    placeholder,
    className,
    ...props
  },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = () => setFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (onBlur) onBlur(e);
    setFocused(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) onChange(e);
    setHasValue(!!e.target.value);
  };

  return (
    <div className="relative">
      <textarea
        ref={ref}
        id={id}
        className={clsx(
          'block w-full resize-none rounded-lg border border-gray-200 text-base text-slate-700 placeholder:text-gray-500 focus:outline-primary-500 disabled:bg-gray-100',
          error && 'outline outline-2 outline-red-500',
          className,
        )}
        aria-describedby={`${id}-error`}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      <label
        htmlFor={id}
        className={clsx(
          'absolute left-4 top-4 cursor-text text-base transition',
          error ? 'text-red-500' : 'text-gray-500',
          (focused || hasValue || defaultValue || value) &&
            '-translate-x-1 -translate-y-6 bg-white text-primary-500',
        )}
      >
        {placeholder}
      </label>
    </div>
  );
});

export default FormTextArea;
