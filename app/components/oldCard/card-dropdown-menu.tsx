import { ChartNoAxesColumnDecreasing, Share } from 'lucide-react';
import Link from 'next/link';

import { useDropdown } from '../../hooks/useDropdown';

interface Props {
  worldcupId: string;
  title: string;
  onOpenShareWorldcupModal: () => void;
}

export default function CardDropdownMenu({ worldcupId, onOpenShareWorldcupModal }: Props) {
  const { dropdownId } = useDropdown();
  const open = dropdownId === worldcupId;

  return (
    <>
      {open && (
        <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
          <ul className="absolute right-0 z-50 flex w-36 animate-modalTransition cursor-pointer flex-col rounded-lg border bg-white p-2 text-left text-base text-slate-700 shadow">
            <Link
              className="dropdown-button my-0.5 flex items-center gap-2 rounded p-2 hover:bg-primary-100 active:bg-primary-200"
              href={`/wc/${worldcupId}/stats`}
            >
              <ChartNoAxesColumnDecreasing size="1.2rem" color="#334155" />
              랭킹 보기
            </Link>
            <button
              className="dropdown-button flex items-center gap-2 rounded p-2 text-left hover:bg-primary-100 active:bg-primary-200"
              onClick={onOpenShareWorldcupModal}
            >
              <Share color="#334155" size="1.2rem" />
              공유
            </button>
          </ul>
        </div>
      )}
    </>
  );
}
