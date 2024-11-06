interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  placeholder?: string;
  error?: string[];
  className?: string;
}

export default function TextArea({
  id,
  placeholder,
  error,
  className,
  ...props
}: TextAreaProps) {
  return (
    <div className='relative'>
      <textarea
        id={id}
        className={`resize-none text-base w-full rounded-lg border border-gray-200 placeholder:text-gray-500 focus:outline-primary-500 text-slate-700
        ${error ? 'outline outline-2 outline-red-500' : ''} ${className}`}
        aria-describedby={`${id}-error`}
        {...props}
      />
      <label
        htmlFor={id}
        className={`${
          error ? 'text-red-500' : 'text-primary-500'
        } absolute top-3 left-4 text-base bg-white transition cursor-text -translate-y-6 -translate-x-1`}
      >
        {placeholder}
      </label>
    </div>
  );
}
