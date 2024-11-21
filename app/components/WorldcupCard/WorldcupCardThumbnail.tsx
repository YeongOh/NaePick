import { useWorldcupCard } from '@/app/hooks/useWorldcupCard';
import CandidateThumbnail from '../CandidateThumbnail';

export default function WorldcupCardThumbnail() {
  const { worldcupCard } = useWorldcupCard();
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

  if (!leftPath && !rightPath) {
    return (
      <div className="inline-flex h-44 w-full">
        <div className="relative flex w-full items-center justify-center overflow-hidden bg-gray-900 sm:rounded-xl">
          <p className="text-base font-semibold text-white">준비 중입니다.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="inline-flex h-44 w-full">
        {leftPath ? (
          <div className="relative w-1/2 overflow-hidden sm:rounded-bl-xl sm:rounded-tl-xl">
            <CandidateThumbnail
              path={leftPath}
              name={leftName || ''}
              mediaType={leftMediaType || ''}
              thumbnailURL={leftThumbnailUrl}
              size="medium"
            />
            <div className="absolute bottom-0 h-auto w-full bg-black/30">
              <p
                className="drop-shadow-text truncate px-1.5 text-center text-base font-semibold text-white"
                title={leftName || ''}
              >
                {leftName}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative w-1/2 overflow-hidden bg-black sm:rounded-br-xl sm:rounded-tr-xl"></div>
        )}
        {rightPath ? (
          <div className="relative w-1/2 overflow-hidden sm:rounded-br-xl sm:rounded-tr-xl">
            <CandidateThumbnail
              path={rightPath}
              name={rightName || ''}
              mediaType={rightMediaType || ''}
              thumbnailURL={rightThumbnailUrl}
              size="medium"
            />
            <div className="absolute bottom-0 h-auto w-full bg-black/30">
              <p
                className="drop-shadow-text truncate px-1.5 text-center text-base font-semibold text-white"
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
