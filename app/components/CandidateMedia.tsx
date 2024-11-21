import { forwardRef, useState } from 'react';

import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';

import MyImage from '@/app/ui/MyImage';

interface Props {
  screenMode?: boolean;
  path: string;
  name: string;
  mediaType: string;
  allowVideoControl?: boolean;
  onYouTubePlay?: (e: YouTubeEvent) => void;
  onYouTubeEnd?: (e: YouTubeEvent) => void;
}

const CandidateMedia = forwardRef<YouTube, Props>(function CandidateMedia(
  { screenMode, path, name, mediaType, onYouTubePlay }: Props,
  ref,
) {
  const [youTubePlayer, setYouTubePlayer] = useState<YouTubePlayer | null>(null);

  let youtubePath = path;
  let youtubeStartTime = 0;
  let youtubeEndTime = 0;
  if (mediaType === 'youtube' && path.includes('?')) {
    const tokens = youtubePath.split('?'); // id?s=0&e=0
    youtubePath = tokens[0];
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
        <div className="size-full max-h-fit max-w-fit lg:max-h-[85svh]">
          <video
            className="h-full w-full object-contain"
            autoPlay
            playsInline
            loop
            muted={screenMode}
            controls={!screenMode}
          >
            <source src={`https://cdn.naepick.co.kr/${path}`} type="video/mp4" />
          </video>
        </div>
      )}
      {mediaType === 'cdn_img' && (
        <div className="size-full max-h-fit max-w-fit lg:max-h-[85svh]">
          <MyImage className="size-full object-contain" src={`${path}?w=1920&h=1760`} alt={name} />
        </div>
      )}
      {mediaType === 'youtube' && (
        <div
          className={`flex size-full justify-center ${screenMode ? 'items-start lg:pt-10' : 'items-center'}`}
        >
          <YouTube
            className={`max-h-full ${screenMode ? 'h-full w-3/4 lg:h-[85%] lg:w-full' : 'h-full w-full'}`}
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
            id={youtubePath}
            videoId={youtubePath}
            title="YouTube video player"
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
          className={`flex size-full justify-center ${screenMode ? 'items-start lg:pt-10' : 'items-center'}`}
        >
          <iframe
            className={`max-h-full ${screenMode ? 'h-full w-3/4 lg:h-[85%] lg:w-full' : 'h-full w-full'}`}
            onClick={(e) => e.stopPropagation()}
            src={`https://chzzk.naver.com/embed/clip/${path}`}
            title="CHZZK Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      )}
    </>
  );
});

export default CandidateMedia;
