import Link from 'next/link';
import ShareWorldcupModal from '../modal/share-worldcup-modal';
import { useState } from 'react';

interface Props {
  open: boolean;
  worldcupId: string;
  title: string;
}

export default function Menubar({ open, worldcupId, title }: Props) {
  const [showShareWorldCupModal, setShowShareWorldCupModal] = useState(false);

  return (
    <>
      {open && (
        <>
          <ul className='absolute border bg-white rounded-lg flex flex-col w-[150px] text-left text-base shadow cursor-pointer'>
            <Link
              className='p-3 mx-2 mt-2 hover:bg-gray-100'
              href={`/worldcups/${worldcupId}`}
            >
              시작 하기
            </Link>
            <Link
              className='p-3 mx-2 my-1 hover:bg-gray-100'
              href={`/worldcups/${worldcupId}/statistics`}
            >
              통계 보기
            </Link>
            <button
              className='p-3 m-2 mb-2 hover:bg-gray-100 text-left'
              onClick={() => {
                console.log('here');
                setShowShareWorldCupModal(true);
              }}
            >
              공유
            </button>
            <ShareWorldcupModal
              open={showShareWorldCupModal}
              onClose={() => setShowShareWorldCupModal(false)}
              worldcupId={worldcupId}
              title={title}
            />
          </ul>
        </>
      )}
    </>
  );
}
