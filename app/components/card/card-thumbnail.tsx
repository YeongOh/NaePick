/* eslint-disable @next/next/no-img-element */
import { WorldcupCard } from '@/app/lib/types';
import ThumbnailImage from '../ThumbnailImage';

interface Props {
  worldcupCard: WorldcupCard;
}

export default function CardThumbnail({ worldcupCard }: Props) {
  const {
    leftName,
    leftPath,
    leftMediaType,
    leftThumbnailUrl,
    rightName,
    rightPath,
    rightMediaType,
    rightThumbnailUrl,
  } = worldcupCard;

  return (
    <>
      <div className={`inline-flex w-full h-44 group`}>
        {leftPath ? (
          <>
            <div className="relative w-1/2 overflow-hidden sm:rounded-tl-xl sm:rounded-bl-xl">
              <ThumbnailImage
                path={leftPath}
                name={leftName}
                mediaType={leftMediaType}
                thumbnailURL={leftThumbnailUrl}
                size="medium"
              />
              <div className="bg-black/30 absolute h-auto bottom-0 w-full">
                <p
                  className="text-center text-white text-base truncate drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-semibold px-1.5"
                  title={leftName}
                >
                  {leftName}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="relative w-1/2 overflow-hidden sm:rounded-tl-xl sm:rounded-bl-xl bg-black"></div>
        )}
        {rightPath ? (
          <div className="relative w-1/2 overflow-hidden sm:rounded-tr-xl sm:rounded-br-xl">
            <ThumbnailImage
              path={rightPath}
              name={rightName}
              mediaType={rightMediaType}
              thumbnailURL={rightThumbnailUrl}
              size="medium"
            />
            <div className="bg-black/30 absolute h-auto bottom-0 w-full">
              <p
                className="text-center text-white text-base truncate drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-semibold px-1.5"
                title={rightName}
              >
                {rightName}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative w-1/2 overflow-hidden sm:rounded-tr-xl sm:rounded-br-xl bg-black"></div>
        )}
      </div>
    </>
  );
}
