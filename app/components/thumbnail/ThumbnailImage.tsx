/* eslint-disable @next/next/no-img-element */
import { WorldcupCard } from '@/app/lib/definitions';
import MyImage from '@/app/ui/my-image/my-image';
import CandidateThumbnailImage from './CandidateThumbnailImage';

interface Props {
  worldcupCard: WorldcupCard;
}

export default function ThumbnailImage({ worldcupCard }: Props) {
  const {
    leftCandidateName,
    leftCandidatePathname,
    leftCandidateMediaType,
    leftCandidateThumbnailURL,
    rightCandidateName,
    rightCandidatePathname,
    rightCandidateMediaType,
    rightCandidateThumbnailURL,
  } = worldcupCard;

  return (
    <>
      <div
        className={`inline-flex bg-black w-full h-[175px] overflow-hidden rounded-xl`}
      >
        {leftCandidatePathname && (
          <>
            <div className='relative w-1/2'>
              <CandidateThumbnailImage
                pathname={leftCandidatePathname}
                name={leftCandidateName}
                mediaType={leftCandidateMediaType}
                thumbnailURL={leftCandidateThumbnailURL}
                size='medium'
              />
              <div className='bg-black/30 absolute h-auto bottom-0 w-full'>
                <p
                  className='text-center text-white text-base truncate drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-bold'
                  title={leftCandidateName}
                >
                  {leftCandidateName}
                </p>
              </div>
            </div>
          </>
        )}
        {rightCandidatePathname && (
          <div className='relative w-1/2'>
            <CandidateThumbnailImage
              pathname={rightCandidatePathname}
              name={rightCandidateName}
              mediaType={rightCandidateMediaType}
              thumbnailURL={rightCandidateThumbnailURL}
              size='medium'
            />
            <div className='bg-black/30 absolute h-auto bottom-0 w-full'>
              <p
                className='text-center text-white text-base truncate drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-bold'
                title={rightCandidateName}
              >
                {rightCandidateName}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
