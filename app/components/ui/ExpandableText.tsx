import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

interface Props {
  text: string;
  numberOfLines: number;
  className?: string;
}

export default function ExpandableText({ text, numberOfLines, className }: Props) {
  const [hide, setHide] = useState<boolean | null>(null);
  const ref = useRef<HTMLParagraphElement>(null);

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
          `line-clamp-${numberOfLines}`,
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
