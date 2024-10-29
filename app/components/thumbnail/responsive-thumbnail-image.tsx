/* eslint-disable @next/next/no-img-element */
import { VIDEO_ORIGIN } from '@/app/constants';
import { getYoutubeThumbnailURL } from '@/app/lib/actions/videos/youtube';
import { MediaType } from '@/app/lib/definitions';
import MyImage from '@/app/components/ui/my-image/my-image';
import { mp4toJpg } from '@/app/utils/utils';
import { useState } from 'react';

interface Props {
  onClick?: () => void;
  size: 'small' | 'medium' | 'large';
  pathname: string;
  name: string;
  mediaType: MediaType;
  thumbnailURL?: string;
}

export default function ResponsiveThumbnailImage({
  onClick,
  size,
  pathname,
  name,
  mediaType,
  thumbnailURL,
}: Props) {
  if (mediaType === 'cdn_img') {
    let params;
    if (size === 'small') params = 'w=128&h=128';
    if (size === 'medium') params = 'w=300&h=350';
    if (size === 'large') params = 'w=500&h=500';
    return (
      <MyImage
        className='object-cover size-full'
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
        className='object-cover size-full'
        src={`${mp4toJpg(pathname)}?${params}`}
        alt={name}
        onClick={onClick}
      />
    );
  }

  if (mediaType === 'youtube') {
    const youtubeThumbnailURL = getYoutubeThumbnailURL(pathname, size);
    return (
      <img
        onClick={onClick}
        className='size-full object-cover'
        src={youtubeThumbnailURL}
        alt={name}
      />
    );
  }

  if (mediaType === 'chzzk') {
    return (
      <img
        onClick={onClick}
        className='size-full object-cover'
        src={thumbnailURL}
        alt={name}
      />
    );
  }
}
