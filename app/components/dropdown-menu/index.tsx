import Link from 'next/link';
import ShareWorldcupModal from '../modal/share-worldcup-modal';
import { useState } from 'react';

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
        <div className='menubar'>
          <ul className='absolute border bg-white rounded-lg flex flex-col w-[150px] text-left text-base shadow cursor-pointer text-slate-700 p-2'>
            <Link
              className='p-2 hover:bg-gray-100'
              href={`/worldcups/${worldcupId}`}
            >
              시작 하기
            </Link>
            <Link
              className='p-2 my-0.5 hover:bg-gray-100'
              href={`/worldcups/${worldcupId}/statistics`}
            >
              통계 보기
            </Link>
            <button
              className='p-2 hover:bg-gray-100 text-left'
              onClick={() => {
                console.log('here');
                setShareWorldcupModal(true);
              }}
            >
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
