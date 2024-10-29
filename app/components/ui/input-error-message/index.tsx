import { MdErrorOutline } from 'react-icons/md';

interface Props {
  className?: string;
  errors?: string[];
}

export default function InputErrorMessage({ errors, className }: Props) {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <div aria-live='polite' aria-atomic='true'>
      {errors.map((errorMsg: string) => (
        <p
          key={errorMsg}
          className={`flex items-center gap-1 text-red-500 text-base ${className}`}
        >
          <MdErrorOutline size={'1.2rem'} />
          {errorMsg}
        </p>
      ))}
    </div>
  );
}
