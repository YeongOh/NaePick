/* eslint-disable @next/next/no-img-element */

import { BASE_IMAGE_URL } from '@/app/constants';

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
      src={`${BASE_IMAGE_URL}${src}`}
      alt={alt}
      onClick={onClick}
      {...otherProps}
    />
  );
}
