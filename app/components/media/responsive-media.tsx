import { MediaType } from '@/app/lib/definitions';
import MyImage from '@/app/components/ui/my-image';
import { forwardRef } from 'react';
import YouTube, { YouTubeEvent } from 'react-youtube';

interface Props {
  lowerHeight?: boolean;
  pathname: string;
  name: string;
  mediaType: MediaType;
  allowVideoControl?: boolean;
  onYouTubePlay?: (e: YouTubeEvent) => void;
}

const ResponsiveMedia = forwardRef<YouTube, Props>(function ResponsiveMedia(
  {
    lowerHeight,
    pathname,
    name,
    mediaType,
    allowVideoControl,
    onYouTubePlay,
  }: Props,
  ref
) {
  return (
    <>
      {mediaType === 'cdn_video' && (
        <div className='max-w-fit size-full'>
          <video
            className='w-full h-full object-contain'
            autoPlay
            playsInline
            loop
            muted
            controls={allowVideoControl}
          >
            <source
              src={`https://cdn.naepick.co.kr/${pathname}`}
              type='video/mp4'
            />
          </video>
        </div>
      )}
      {mediaType === 'cdn_img' && (
        <div className='max-w-fit size-full'>
          <MyImage
            className='object-contain size-full'
            src={`${pathname}?w=1920&h=1760`}
            alt={name}
          />
        </div>
      )}
      {mediaType === 'youtube' && (
        <div className='size-full flex items-center justify-center'>
          <YouTube
            className={`w-full max-h-full ${
              lowerHeight ? 'h-[80%]' : 'h-full'
            }`}
            opts={{
              height: '100%',
              width: '100%',
              host: 'https://www.youtube-nocookie.com',
              playerVars: {
                loop: 1,
                rel: 0,
                playsinline: 1,
                color: 'white',
                // start: 5,
                // end: 8,
              },
            }}
            ref={ref}
            id={pathname}
            videoId={pathname}
            title='YouTube video player'
            onPlay={onYouTubePlay}
          />
        </div>
      )}
      {mediaType === 'chzzk' && (
        <div className='size-full flex items-center justify-center'>
          <iframe
            onClick={(e) => e.stopPropagation()}
            src={`https://chzzk.naver.com/embed/clip/${pathname}`}
            title='CHZZK Player'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
            referrerPolicy='strict-origin-when-cross-origin'
            allowFullScreen
          />
        </div>
      )}
    </>
  );
});

export default ResponsiveMedia;
