import Link from 'next/link';
import ShareWorldcupModal from '../modal/share-worldcup-modal';
import { forwardRef, useState } from 'react';

interface Props {
  openMenubar: boolean;
  worldcupId: string;
  title: string;
}

const Menubar = forwardRef<HTMLDivElement, Props>(function Menubar(
  { openMenubar, worldcupId, title }: Props,
  ref
) {
  const [shareWorldcupModal, setShareWorldcupModal] = useState(false);

  return (
    <>
      {openMenubar && (
        <div ref={ref} className='menubar'>
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
});

export default Menubar;
