/* eslint-disable @next/next/no-img-element */
import { IMG_ORIGIN } from '@/app/constants';

interface Props {
  profilePath: string | null;
  size: 'small' | 'medium' | 'large';
  className?: string;
  alt: string | null;
}

export default function Avatar({ profilePath, size, className, alt }: Props) {
  const PROFILE_PLACEHOLDER = 'profile/placeholder.webp';

  return (
    <div
      className={`rounded-full overflow-hidden${size === 'small' ? ' w-9 h-9' : ''}${
        size === 'medium' ? ' w-10 h-10' : ''
      }${size === 'large' ? ' w-20 h-20' : ''} ${className || ''}`}
    >
      <img
        alt={alt ? alt : '탈퇴한 회원'}
        className="size-full object-cover"
        src={`${IMG_ORIGIN}/${profilePath ? profilePath + '?w=80&h=80' : PROFILE_PLACEHOLDER}`}
      />
    </div>
  );
}
