import Link from 'next/link';
import ShareWorldcupModal from '../modal/share-worldcup-modal';
import { useState } from 'react';
import { ChartNoAxesColumnDecreasing, Share } from 'lucide-react';

interface Props {
  openDropdownMenu: boolean;
  worldcupId: string;
  title: string;
}

export default function DropdownMenu({
  openDropdownMenu,
  worldcupId,
  title,
}: Props) {
  const [shareWorldcupModal, setShareWorldcupModal] = useState(false);

  return (
    <>
      {openDropdownMenu && (
        <div className='menubar' onClick={(e) => e.stopPropagation()}>
          <ul className='absolute right-0 border bg-white rounded-lg flex flex-col w-36 text-left text-base shadow cursor-pointer text-slate-700 p-2 z-50 animate-modalTransition'>
            <Link
              className='p-2 my-0.5 hover:bg-primary-100 flex items-center gap-2 rounded active:bg-primary-200'
              href={`/worldcups/${worldcupId}/stats`}
            >
              <ChartNoAxesColumnDecreasing size='1.2rem' color='#334155' />
              랭킹 보기
            </Link>
            <button
              className='p-2 hover:bg-primary-100 text-left flex items-center gap-2 rounded active:bg-primary-200'
              onClick={() => setShareWorldcupModal(true)}
            >
              <Share color='#334155' size='1.2rem' />
              공유
            </button>
            <ShareWorldcupModal
              open={shareWorldcupModal}
              onClose={() => setShareWorldcupModal(false)}
              worldcupId={worldcupId}
              title={title}
            />
          </ul>
        </div>
      )}
    </>
  );
}
