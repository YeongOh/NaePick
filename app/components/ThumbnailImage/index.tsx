/* eslint-disable @next/next/no-img-element */
import MyImage from '@/app/components/ui/my-image';
import { getYoutubeThumbnailURL } from '@/app/lib/videos/youtube';
import { mp4toJpg } from '@/app/utils';

interface Props {
  onClick?: () => void;
  size: 'small' | 'medium' | 'large';
  path: string;
  name: string;
  mediaType: string;
  thumbnailURL: string | null;
}

export default function ThumbnailImage({ onClick, size, path, name, mediaType, thumbnailURL }: Props) {
  if (mediaType === 'cdn_img') {
    let params;
    if (size === 'small') params = 'w=128&h=128';
    if (size === 'medium') params = 'w=300&h=350';
    if (size === 'large') params = 'w=500&h=500';

    return (
      <MyImage className="size-full object-cover" src={`${path}?${params}`} alt={name} onClick={onClick} />
    );
  }

  if (mediaType === 'cdn_video') {
    let params;
    if (size === 'small') params = 'w=128&h=128';
    if (size === 'medium') params = 'w=300&h=350';
    if (size === 'large') params = 'w=500&h=500';
    return (
      <MyImage
        className="size-full object-cover"
        src={`${mp4toJpg(path)}?${params}`}
        alt={name}
        onClick={onClick}
      />
    );
  }

  if (mediaType === 'youtube') {
    const youtubeThumbnailURL = getYoutubeThumbnailURL(path, size);
    return <img onClick={onClick} className="size-full object-cover" src={youtubeThumbnailURL} alt={name} />;
  }

  if (mediaType === 'chzzk') {
    return <img onClick={onClick} className="size-full object-cover" src={thumbnailURL ?? ''} alt={name} />;
  }
}
