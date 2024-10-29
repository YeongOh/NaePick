import { MediaType } from '@/app/lib/definitions';
import MyImage from '@/app/components/ui/my-image';

interface Props {
  lowerHeight: boolean;
  pathname: string;
  name: string;
  mediaType: MediaType;
}

export default function ResponsiveMedia({
  lowerHeight,
  pathname,
  name,
  mediaType,
}: Props) {
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
          <iframe
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-h-full aspect-video ${
              lowerHeight ? 'h-[80%]' : 'h-full'
            }`}
            src={`https://www.youtube-nocookie.com/embed/${pathname}`}
            title='Youtube video player'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
            referrerPolicy='strict-origin-when-cross-origin'
            allowFullScreen
          />
        </div>
      )}
      {mediaType === 'chzzk' && (
        <div className='size-full flex items-center justify-center'>
          <iframe
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-h-full aspect-video ${
              lowerHeight ? 'h-[80%]' : 'h-full'
            }`}
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
}
