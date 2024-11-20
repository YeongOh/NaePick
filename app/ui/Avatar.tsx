/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';

import { IMG_ORIGIN } from '@/app/constants';

interface Props {
  profilePath: string | null;
  size: 'sm' | 'md' | 'lg';
  className?: string;
  alt: string | null;
}

export default function Avatar({ profilePath, size, className, alt }: Props) {
  const PROFILE_PLACEHOLDER = 'profile/placeholder.webp';

  return (
    <div
      className={clsx(
        'overflow-hidden rounded-full',
        size === 'sm' && 'h-8 w-8 lg:h-9 lg:w-9',
        size === 'md' && 'h-10 w-10',
        size === 'lg' && 'h-20 w-20',
        className,
      )}
    >
      <img
        alt={alt ? alt : '탈퇴한 회원'}
        className="size-full object-cover"
        src={`${IMG_ORIGIN}/${profilePath ? profilePath + '?w=80&h=80' : PROFILE_PLACEHOLDER}`}
      />
    </div>
  );
}
