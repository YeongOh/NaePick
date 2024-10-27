/* eslint-disable @next/next/no-img-element */
import { VIDEO_ORIGIN } from '@/app/constants';
import { getYoutubeThumbnailURL } from '@/app/lib/actions/videos/youtube';
import { MediaType } from '@/app/lib/definitions';
import MyImage from '@/app/ui/my-image/my-image';

interface Props {
  pathname: string;
  name: string;
  mediaType: MediaType;
  thumbnailURL?: string;
  onClick?: () => void;
  size: 'small' | 'medium';
}

export default function CandidateThumbnailImage({
  pathname,
  name,
  mediaType,
  thumbnailURL,
  onClick,
  size = 'small',
}: Props) {
  if (mediaType === 'cdn_img') {
    return (
      <MyImage
        className='object-cover size-full cursor-pointer'
        src={`${pathname}?${size === 'medium' && 'w=300&h=350'}${
          size === 'small' && 'w=128&h=128'
        }`}
        alt={name}
        onClick={onClick}
      />
    );
  }
  if (mediaType === 'cdn_video') {
    return (
      <video className='size-full object-cover'>
        <source src={`${VIDEO_ORIGIN}/${pathname}`} type='video/mp4' />
      </video>
    );
  }
  if (mediaType === 'youtube') {
    const youtubeThumbnailURL = getYoutubeThumbnailURL(pathname, size);
    return (
      <img
        className='size-full object-cover'
        src={youtubeThumbnailURL}
        alt={name}
      />
    );
  }
  if (mediaType === 'chzzk') {
    return (
      <img className='size-full object-cover' src={thumbnailURL} alt={name} />
    );
  }
}
