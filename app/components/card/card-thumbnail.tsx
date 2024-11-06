/* eslint-disable @next/next/no-img-element */
import { WorldcupCard } from '@/app/lib/definitions';
import ResponsiveThumbnailImage from '../thumbnail/responsive-thumbnail-image';

interface Props {
  worldcupCard: WorldcupCard;
}

export default function CardThumbnail({ worldcupCard }: Props) {
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
      <div className={`inline-flex w-full h-44 group`}>
        {leftCandidatePathname ? (
          <>
            <div className='relative w-1/2 overflow-hidden sm:rounded-tl-xl sm:rounded-bl-xl'>
              <ResponsiveThumbnailImage
                pathname={leftCandidatePathname}
                name={leftCandidateName}
                mediaType={leftCandidateMediaType}
                thumbnailURL={leftCandidateThumbnailURL}
                size='medium'
              />
              <div className='bg-black/30 absolute h-auto bottom-0 w-full'>
                <p
                  className='text-center text-white text-base truncate drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-semibold px-1.5'
                  title={leftCandidateName}
                >
                  {leftCandidateName}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className='relative w-1/2 overflow-hidden sm:rounded-tl-xl sm:rounded-bl-xl bg-black'></div>
        )}
        {rightCandidatePathname ? (
          <div className='relative w-1/2 overflow-hidden sm:rounded-tr-xl sm:rounded-br-xl'>
            <ResponsiveThumbnailImage
              pathname={rightCandidatePathname}
              name={rightCandidateName}
              mediaType={rightCandidateMediaType}
              thumbnailURL={rightCandidateThumbnailURL}
              size='medium'
            />
            <div className='bg-black/30 absolute h-auto bottom-0 w-full'>
              <p
                className='text-center text-white text-base truncate drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-semibold px-1.5'
                title={rightCandidateName}
              >
                {rightCandidateName}
              </p>
            </div>
          </div>
        ) : (
          <div className='relative w-1/2 overflow-hidden sm:rounded-tr-xl sm:rounded-br-xl bg-black'></div>
        )}
      </div>
    </>
  );
}
