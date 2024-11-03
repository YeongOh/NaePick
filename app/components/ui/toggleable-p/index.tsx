import React, { useEffect, useRef, useState } from 'react';

interface Props {
  text: string;
  numberOfLines: number;
  className?: string;
}

export default function ToggleableP({ text, numberOfLines, className }: Props) {
  const [showMore, setShowMore] = useState<boolean | null>(null);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.clientHeight > numberOfLines * 20) {
      setShowMore(false);
    }
  }, []);

  return (
    <>
      <p
        ref={ref}
        className={`text-base whitespace-pre-line ${
          showMore === true ? 'line-clamp-none' : ''
        } ${
          showMore === false ? `line-clamp-${numberOfLines}` : ''
        } ${className}`}
      >
        {text}
      </p>
      {showMore !== null ? (
        <button
          className='text-gray-500 text-base hover:text-gray-700 hover:underline'
          onClick={() => setShowMore((prev) => !prev)}
        >
          {showMore ? '간략히' : '자세히 보기'}
        </button>
      ) : null}
    </>
  );
}
