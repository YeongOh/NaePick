import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  totalPages: number;
  currentPageNumber: number;
  range: number;
  onPageNumberClick: (page: number) => void;
}

export default function Pagination({
  totalPages,
  currentPageNumber,
  range,
  onPageNumberClick,
}: Props) {
  const lowerEnd =
    currentPageNumber - range < 1 ? 1 : currentPageNumber - range;
  const higherEnd =
    currentPageNumber + range > totalPages
      ? totalPages
      : currentPageNumber + range;

  return (
    <div className='bg-white h-12 flex items-center justify-center gap-1 text-base text-slate-700'>
      <button
        disabled={currentPageNumber === 1}
        className={`w-14 h-10 rounded flex justify-center items-center ${
          currentPageNumber === 1 ? '' : 'hover:bg-gray-50'
        }`}
      >
        <ChevronLeft color={currentPageNumber === 1 ? '#e5e7eb ' : undefined} />
      </button>
      {new Array(higherEnd + 1 - lowerEnd).fill(0).map((_, index) => {
        const pageNumber = lowerEnd + index;
        const isSelected = pageNumber === currentPageNumber;
        return (
          <button
            key={`page-number ${pageNumber}`}
            className={`w-10 h-10 rounded ${
              isSelected
                ? 'bg-primary-500 text-white font-semibold cursor-default'
                : 'bg-white hover:bg-gray-50 active:bg-gray-100'
            }`}
            onClick={() => onPageNumberClick(pageNumber)}
            tabIndex={isSelected ? -1 : 0}
          >
            {pageNumber}
          </button>
        );
      })}
      <button
        disabled={currentPageNumber === totalPages}
        className={`w-14 h-10 rounded flex justify-center items-center ${
          currentPageNumber === 1 ? '' : 'hover:bg-gray-50'
        }`}
      >
        <ChevronRight
          color={currentPageNumber === totalPages ? '#e5e7eb ' : undefined}
        />
      </button>
    </div>
  );
}
