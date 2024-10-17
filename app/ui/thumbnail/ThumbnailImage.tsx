import { BASE_IMAGE_URL } from '@/app/lib/images';
import Image from 'next/image';

interface Props {
  postId: string;
  leftCandidateUrl: string;
  leftCandidateName: string;
  rightCandidateUrl: string;
  rightCandidateName: string;
}

export default function ThumbnailImage({
  leftCandidateUrl,
  leftCandidateName,
  rightCandidateUrl,
  rightCandidateName,
}: Props) {
  return (
    <>
      <div
        className={`inline-flex bg-black w-full h-[150px] overflow-hidden rounded-xl`}
      >
        {leftCandidateUrl && (
          <>
            <div className='relative w-1/2'>
              <Image
                className='object-cover'
                src={`${BASE_IMAGE_URL}${leftCandidateUrl}`}
                alt={leftCandidateName}
                fill={true}
                sizes='(max-width: 768px) 66vw, (max-width: 1200px) 33vw'
                priority={true}
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
        {rightCandidateUrl && (
          <div className='relative w-1/2'>
            <Image
              className='object-cover'
              src={`${BASE_IMAGE_URL}${rightCandidateUrl}`}
              alt={rightCandidateName}
              fill={true}
              sizes='(max-width: 768px) 66vw, (max-width: 1200px) 33vw'
              priority={true}
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
