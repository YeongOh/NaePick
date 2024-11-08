/* eslint-disable @next/next/no-img-element */
import { MediaType } from '@/app/lib/types';
import MyImage from '@/app/components/ui/my-image';
import { mp4toJpg } from '@/app/utils';
import { getYoutubeThumbnailURL } from '@/app/lib/videos/youtube';

interface Props {
  onClick?: () => void;
  size: 'small' | 'medium' | 'large';
  pathname: string;
  name: string;
  mediaType: string;
  thumbnailURL: string | null;
}

export default function ThumbnailImage({ onClick, size, pathname, name, mediaType, thumbnailURL }: Props) {
  if (mediaType === 'cdn_img') {
    let params;
    if (size === 'small') params = 'w=128&h=128';
    if (size === 'medium') params = 'w=300&h=350';
    if (size === 'large') params = 'w=500&h=500';
    return (
      <MyImage
        className="object-cover size-full"
        src={`${pathname}?${params}`}
        alt={name}
        onClick={onClick}
      />
    );
  }

  if (mediaType === 'cdn_video') {
    let params;
    if (size === 'small') params = 'w=128&h=128';
    if (size === 'medium') params = 'w=300&h=350';
    if (size === 'large') params = 'w=500&h=500';
    return (
      <MyImage
        className="object-cover size-full"
        src={`${mp4toJpg(pathname)}?${params}`}
        alt={name}
        onClick={onClick}
      />
    );
  }

  if (mediaType === 'youtube') {
    const youtubeThumbnailURL = getYoutubeThumbnailURL(pathname, size);
    return <img onClick={onClick} className="size-full object-cover" src={youtubeThumbnailURL} alt={name} />;
  }

  if (mediaType === 'chzzk') {
    return <img onClick={onClick} className="size-full object-cover" src={thumbnailURL} alt={name} />;
  }
}
