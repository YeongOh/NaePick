import { MediaType } from '@/app/lib/definitions';
import MyImage from '@/app/components/ui/my-image';
import { forwardRef, useState } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';

interface Props {
  lowerHeight?: boolean;
  pathname: string;
  name: string;
  mediaType: MediaType;
  allowVideoControl?: boolean;
  onYouTubePlay?: (e: YouTubeEvent) => void;
  onYouTubeEnd?: (e: YouTubeEvent) => void;
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
  const [youTubePlayer, setYouTubePlayer] = useState<YouTubePlayer | null>(
    null
  );

  let youtubePathname = pathname;
  let youtubeStartTime = 0;
  let youtubeEndTime = 0;
  if (mediaType === 'youtube' && pathname.includes('?')) {
    const tokens = youtubePathname.split('?'); // id?s=0&e=0
    youtubePathname = tokens[0];
    const timeTokens = tokens[1].split('&'); // s=0&e=0
    youtubeStartTime = Number(timeTokens[0].slice(2)); // s=0
    youtubeEndTime = Number(timeTokens[1].slice(2)); // e=0
  }

  const handleYouTubeEnd = (e: YouTubeEvent) => {
    youTubePlayer.seekTo(youtubeStartTime);
    youTubePlayer.playVideo();
  };

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
        <div
          className={`size-full flex justify-center ${
            lowerHeight ? '' : 'items-center'
          }`}
        >
          <YouTube
            className={`w-full max-h-full ${
              lowerHeight ? 'h-[85%]' : 'h-full'
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
                start: youtubeStartTime,
                end: youtubeEndTime,
              },
            }}
            ref={ref}
            id={youtubePathname}
            videoId={youtubePathname}
            title='YouTube video player'
            onPlay={(e: YouTubeEvent) => {
              if (!youTubePlayer) {
                setYouTubePlayer(e.target);
              }
              if (onYouTubePlay) {
                onYouTubePlay(e);
              }
            }}
            onEnd={(e: YouTubeEvent) => {
              if (!youTubePlayer) {
                setYouTubePlayer(e.target);
              }

              handleYouTubeEnd(e);
            }}
          />
        </div>
      )}
      {mediaType === 'chzzk' && (
        <div
          className={`w-full ${
            lowerHeight ? 'h-[85%]' : 'h-full'
          } flex items-center justify-center`}
        >
          <iframe
            className='size-full'
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
