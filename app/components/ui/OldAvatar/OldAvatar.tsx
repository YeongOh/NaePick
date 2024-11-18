/* eslint-disable @next/next/no-img-element */
import { IMG_ORIGIN } from '@/app/constants';

interface Props {
  profilePath: string | null;
  size: 'small' | 'medium' | 'large';
  className?: string;
  alt: string | null;
}

export default function OldAvatar({ profilePath, size, className, alt }: Props) {
  const PROFILE_PLACEHOLDER = 'profile/placeholder.webp';

  return (
    <div
      className={`overflow-hidden rounded-full ${size === 'small' ? 'h-8 w-8 lg:h-9 lg:w-9' : ''}${
        size === 'medium' ? 'h-10 w-10' : ''
      }${size === 'large' ? 'h-20 w-20' : ''} ${className || ''}`}
    >
      <img
        alt={alt ? alt : '탈퇴한 회원'}
        className="size-full object-cover"
        src={`${IMG_ORIGIN}/${profilePath ? profilePath + '?w=80&h=80' : PROFILE_PLACEHOLDER}`}
      />
    </div>
  );
}
