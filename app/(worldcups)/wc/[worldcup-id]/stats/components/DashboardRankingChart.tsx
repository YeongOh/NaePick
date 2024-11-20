import CandidateThumbnail from '@/app/components/CandidateThumbnail';

import { CandidateStatModel } from './Dashboard';

interface Props {
  onShowDetails: (index: number) => void;
  candidates: CandidateStatModel[];
  selectedIndex: number;
  page: number;
}

export default function DashboardRankingChart({ onShowDetails, candidates, selectedIndex, page }: Props) {
  return (
    <ul className="overflow-hidden rounded">
      <div className="flex h-8 items-center border-b bg-gray-50 text-sm text-gray-500">
        <div className="w-12 text-center">순위</div>
        <div className="w-16 overflow-hidden rounded"></div>
        <div className="ml-4 flex-1 text-left">이름</div>
        <div className="mr-4 w-20 text-center">승률</div>
      </div>
      {candidates.map((candidate, i) => {
        const isSelected = i === selectedIndex;
        return (
          <li
            className={`flex cursor-pointer items-center border-b py-1 text-base transition-colors ${
              isSelected ? 'bg-primary-200' : 'bg-white hover:bg-primary-50'
            }`}
            key={candidate.id + i}
            onClick={() => onShowDetails(i)}
          >
            <div className="w-12 text-center text-gray-500">{(page - 1) * 10 + i + 1}</div>
            <div className="h-16 w-16 overflow-hidden rounded">
              <CandidateThumbnail
                name={candidate.name}
                mediaType={candidate.mediaType}
                path={candidate.path}
                thumbnailURL={candidate.thumbnailUrl}
                size="small"
              />
            </div>
            <div className="ml-4 flex-1 truncate text-left font-semibold text-slate-700">
              {candidate.name}
            </div>
            <div className="mr-4 w-20 text-center text-slate-700">
              {(candidate.winRate * 100).toFixed(1)}%
            </div>
          </li>
        );
      })}
    </ul>
  );
}
