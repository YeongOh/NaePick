/* eslint-disable @next/next/no-img-element */
import { VIDEO_ORIGIN } from '@/app/constants';
import { getYoutubeThumbnailURL } from '@/app/lib/actions/videos/youtube';
import { Candidate } from '@/app/lib/definitions';
import MyImage from '@/app/ui/my-image/my-image';

interface Props {
  candidate: Candidate;
  onClick: () => void;
}

export default function CandidateThumbnailImage({ candidate, onClick }: Props) {
  if (candidate.mediaType === 'cdn_img') {
    return (
      <MyImage
        className='object-cover size-full cursor-pointer'
        src={`${candidate.pathname}?w=128&h=128`}
        alt={candidate.name}
        onClick={onClick}
      />
    );
  }
  if (candidate.mediaType === 'cdn_video') {
    return (
      <video className='w-full h-full object-cover'>
        <source
          src={`${VIDEO_ORIGIN}/${candidate.pathname}`}
          type='video/mp4'
        />
      </video>
    );
  }
  if (candidate.mediaType === 'youtube') {
    const youtubeThumbnailURL = getYoutubeThumbnailURL(
      candidate.pathname,
      'small'
    );
    return (
      <img
        className='w-full h-full object-cover'
        src={youtubeThumbnailURL}
        alt={candidate.name}
      />
    );
  }
  if (candidate.mediaType === 'chzzk') {
    return (
      <img
        className='w-full h-full object-cover'
        src={candidate.thumbnailURL}
        alt={candidate.name}
      />
    );
  }
}
