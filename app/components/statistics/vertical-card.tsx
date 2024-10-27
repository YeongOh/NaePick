import { CandidateWithStatistics } from '@/app/lib/definitions';
import MyImage from '@/app/ui/my-image/my-image';

interface Props {
  candidate: CandidateWithStatistics;
}

export default function VerticalCard({ candidate }: Props) {
  return (
    <>
      {candidate.mediaType === 'cdn_video' && (
        <div className='max-w-fit w-full h-full'>
          <video
            className='w-full h-full object-contain'
            autoPlay
            playsInline
            loop
            muted
          >
            <source
              src={`https://cdn.naepick.co.kr/${candidate.pathname}`}
              type='video/mp4'
            />
          </video>
        </div>
      )}
      {candidate.mediaType === 'cdn_img' && (
        <div className='max-w-fit w-full h-full'>
          <MyImage
            className='object-cover w-full h-full'
            src={`${candidate.pathname}?w=1920&h=1760`}
            alt={candidate.name}
          />
        </div>
      )}
      {candidate.mediaType === 'youtube' && (
        <div className='size-full flex items-center justify-center'>
          <iframe
            onClick={(e) => e.stopPropagation()}
            className='w-full h-full max-h-full aspect-video'
            src={`https://www.youtube-nocookie.com/embed/${candidate.pathname}`}
            title='Youtube video player'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
            referrerPolicy='strict-origin-when-cross-origin'
            allowFullScreen
          />
        </div>
      )}
    </>
  );
}
