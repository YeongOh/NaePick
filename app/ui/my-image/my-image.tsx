/* eslint-disable @next/next/no-img-element */

import { IMG_ORIGIN } from '@/app/constants';

interface Props {
  className?: string;
  src: string;
  alt: string;
  onClick?: () => void;
}

export default function MyImage({
  className,
  src,
  alt,
  onClick,
  ...otherProps
}: Props) {
  return (
    <img
      className={className}
      src={`${IMG_ORIGIN}/${src}`}
      alt={alt}
      onClick={onClick}
      {...otherProps}
    />
  );
}
