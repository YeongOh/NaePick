import { CandidateWithStatistics } from '@/app/lib/definitions';

interface Props {
  candidate: CandidateWithStatistics;
  isSelected: boolean;
}

export default function ThumbnailWinrateOverlay({
  candidate,
  isSelected,
}: Props) {
  return (
    <>
      <div
        className={`absolute size-full opacity-0 transition-opacity bg-black text-white font-semibold ${
          isSelected ? 'opacity-80' : 'group-hover:opacity-80'
        }`}
      >
        <div className='flex flex-col p-2 justify-between size-full'>
          <div>
            <div className='text-5xl'>
              {!candidate.winrate ? 0 : candidate.winrate.toFixed(1)}%
            </div>
            <div className='text-2xl'>Win/Loss</div>
          </div>
          <div>
            <div className='text-xl'>
              {!candidate.championRate ? 0 : candidate.championRate.toFixed(1)}%
            </div>
            <div className='text-xl'>Champion</div>
          </div>
          <span>
            {candidate.numberOfWins}W - {candidate.numberOfLosses}L
          </span>
        </div>
        <div
          className={`absolute left-3/4 top-full origin-top-left transform -rotate-90 transition-transform text-2xl w-full ${
            isSelected ? '-translate-y-8' : 'group-hover:-translate-y-8'
          }`}
        >
          {candidate.name}
        </div>
      </div>
      <span
        className={`absolute text-white left-1 bottom-1 font-semibold text-lg group-hover:opacity-0 cursor-default drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] ${
          isSelected ? 'invisible' : 'visible'
        }`}
      >
        {candidate.name}
      </span>
    </>
  );
}
