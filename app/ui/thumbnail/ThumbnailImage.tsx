import { Thumbnail } from '@/app/lib/definitions';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  postId: string;
  leftCandidateUrl: string;
  leftCandidateName: string;
  rightCandidateUrl: string;
  rightCandidateName: string;
}

export default function ThumbnailImage({
  postId,
  leftCandidateUrl,
  leftCandidateName,
  rightCandidateUrl,
  rightCandidateName,
}: Props) {
  return (
    <>
      <Link
        href={`/posts/${postId}`}
        className='inline-flex bg-black w-full h-[150px] overflow-hidden rounded-xl'
      >
        {leftCandidateUrl && (
          <>
            <div className='relative w-1/2'>
              <Image
                className='object-cover'
                src={leftCandidateUrl}
                alt={leftCandidateName}
                fill={true}
                sizes='(max-width: 768px) 66vw, (max-width: 1200px) 33vw'
              />
              <p
                className='w-full absolute bottom-0 text-center text-white text-sm truncate drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-bold'
                title={leftCandidateName}
              >
                {leftCandidateName}
              </p>
            </div>
          </>
        )}
        {rightCandidateUrl && (
          <div className='relative w-1/2'>
            <Image
              className='object-cover'
              src={rightCandidateUrl}
              alt={rightCandidateName}
              fill={true}
              sizes='(max-width: 768px) 66vw, (max-width: 1200px) 33vw'
            />
            <p
              className='w-full absolute bottom-0 text-center text-white text-sm truncate drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-bold'
              title={rightCandidateName}
            >
              {rightCandidateName}
            </p>
          </div>
        )}
        {!rightCandidateUrl && (
          <div className='relative w-1/2 text-white'>이미지 오류1</div>
        )}

        {!leftCandidateUrl && (
          <div className='relative w-1/2 text-white'>이미지 오류2</div>
        )}
      </Link>
    </>
  );
}
