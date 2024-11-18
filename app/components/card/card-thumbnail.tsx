import { TCard } from '@/app/lib/types';

import ThumbnailImage from '../ThumbnailImage';

interface Props {
  worldcupCard: TCard;
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
      <div className={`group inline-flex h-44 w-full`}>
        {leftPath ? (
          <>
            <div className="relative w-1/2 overflow-hidden sm:rounded-bl-xl sm:rounded-tl-xl">
              <ThumbnailImage
                path={leftPath}
                name={leftName || ''}
                mediaType={leftMediaType || ''}
                thumbnailURL={leftThumbnailUrl}
                size="medium"
              />
              <div className="absolute bottom-0 h-auto w-full bg-black/30">
                <p
                  className="truncate px-1.5 text-center text-base font-semibold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
                  title={leftName || ''}
                >
                  {leftName}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="relative w-1/2 overflow-hidden bg-black sm:rounded-bl-xl sm:rounded-tl-xl"></div>
        )}
        {rightPath ? (
          <div className="relative w-1/2 overflow-hidden sm:rounded-br-xl sm:rounded-tr-xl">
            <ThumbnailImage
              path={rightPath}
              name={rightName || ''}
              mediaType={rightMediaType || ''}
              thumbnailURL={rightThumbnailUrl}
              size="medium"
            />
            <div className="absolute bottom-0 h-auto w-full bg-black/30">
              <p
                className="truncate px-1.5 text-center text-base font-semibold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
                title={rightName || ''}
              >
                {rightName}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative w-1/2 overflow-hidden bg-black sm:rounded-br-xl sm:rounded-tr-xl"></div>
        )}
      </div>
    </>
  );
}
