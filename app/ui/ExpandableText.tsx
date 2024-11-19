import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

interface Props {
  text: string;
  size: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ExpandableText({ text, size = 'md', className }: Props) {
  const [hide, setHide] = useState<boolean | null>(null);
  const ref = useRef<HTMLParagraphElement>(null);
  const numberOfLines = size === 'sm' ? 3 : size === 'md' ? 5 : size === 'lg' ? 7 : 0;

  useEffect(() => {
    if (ref.current && ref.current.clientHeight > numberOfLines * 20) {
      setHide(true);
    }
  }, [numberOfLines]);

  return (
    <>
      <p
        ref={ref}
        className={clsx(
          'whitespace-pre-line text-base',
          size === 'sm' && `line-clamp-3`,
          size === 'md' && `line-clamp-5`,
          size === 'lg' && `line-clamp-7`,
          !hide && 'line-clamp-none',
          className,
        )}
      >
        {text}
      </p>
      {hide !== null && (
        <button
          className="text-base text-gray-500 hover:text-gray-700 hover:underline"
          onClick={() => setHide((prev) => !prev)}
        >
          {hide ? '자세히 보기' : '간략히'}
        </button>
      )}
    </>
  );
}
