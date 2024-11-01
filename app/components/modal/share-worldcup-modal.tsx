'use client';

import { DOMAIN } from '@/app/constants';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  worldcupId: string;
}

export default function ShareWorldcupModal({
  open,
  title,
  onClose,
  worldcupId,
}: Props) {
  const focusedRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    focusedRef?.current?.select();
  }, [open]);

  const handleCopyShareLInk = async () => {
    await navigator.clipboard.writeText(`${DOMAIN}/worldcups/${worldcupId}`);
    toast.success('복사되었습니다.');
  };

  return (
    <>
      {open &&
        createPortal(
          <div
            className='modal fixed inset-0 z-50 bg-black/30 w-screen h-screen'
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className='fixed inset-0 m-auto border w-[420px] h-fit bg-white p-4 rounded-xl animate-modalTransition'
            >
              <h2 className='font-semibold text-center mb-4 text-md'>
                {title} 공유하기
              </h2>
              <div className='flex flex-col items-center justify-between'>
                <div className='relative w-full text-base border bg-gray-50 rounded-lg p-4 whitespace-nowrap overflow-hidden'>
                  <input
                    className='w-[80%] bg-gray-50'
                    ref={focusedRef}
                    onBlur={() => {
                      focusedRef.current = null;
                    }}
                    defaultValue={`${DOMAIN}/worldcups/${worldcupId}`}
                    readOnly
                  />
                  <button
                    onClick={handleCopyShareLInk}
                    className='absolute top-2 right-2 bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors'
                  >
                    복사
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
