import { Info } from 'lucide-react';

interface Props {
  className?: string;
  errors?: string[] | string;
  replacedErrorMessage?: string;
}

export default function InputErrorMessage({ errors, className, replacedErrorMessage }: Props) {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <div aria-live="polite" aria-atomic="true">
      {Array.isArray(errors) ? (
        errors.map((errorMsg: string) => (
          <p
            key={replacedErrorMessage ? replacedErrorMessage : errorMsg}
            className={`flex items-center gap-1 text-base text-red-500 ${className}`}
          >
            <Info color="#ef4444" size="1.2rem" />
            {replacedErrorMessage ? replacedErrorMessage : errorMsg}
          </p>
        ))
      ) : (
        <p
          key={replacedErrorMessage ? replacedErrorMessage : errors}
          className={`flex items-center gap-1 text-base text-red-500 ${className}`}
        >
          <Info color="#ef4444" size="1.2rem" />
          {replacedErrorMessage ? replacedErrorMessage : errors}
        </p>
      )}
    </div>
  );
}
