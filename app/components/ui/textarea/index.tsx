interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  placeholder?: string;
  error?: string[] | boolean;
  className?: string;
}

export default function TextArea({ id, placeholder, error, className, ...props }: TextAreaProps) {
  return (
    <div className="relative">
      <textarea
        id={id}
        className={`w-full resize-none rounded-lg border border-gray-200 text-base text-slate-700 placeholder:text-gray-500 focus:outline-primary-500 ${error ? 'outline outline-2 outline-red-500' : ''} ${className}`}
        aria-describedby={`${id}-error`}
        {...props}
      />
      <label
        htmlFor={id}
        className={`${
          error ? 'text-red-500' : 'text-primary-500'
        } absolute left-4 top-3 -translate-x-1 -translate-y-6 cursor-text bg-white text-base transition`}
      >
        {placeholder}
      </label>
    </div>
  );
}
