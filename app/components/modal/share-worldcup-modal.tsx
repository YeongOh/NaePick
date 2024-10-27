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
            className='fixed inset-0 z-99 bg-black/30 w-screen h-screen y-scroll-hidden'
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] border bg-white p-4 rounded-xl'
            >
              <h2 className='font-semibold text-center mb-4'>
                {title} 공유하기
              </h2>
              <div className='flex flex-col items-center justify-between'>
                <div className='relative w-full text-base border bg-gray-50 rounded-lg p-4 whitespace-nowrap overflow-hidden'>
                  <input
                    className='w-[80%]'
                    ref={focusedRef}
                    onBlur={() => {
                      focusedRef.current = null;
                    }}
                    value={`${DOMAIN}/worldcups/${worldcupId}`}
                  />
                  <button
                    onClick={handleCopyShareLInk}
                    className='absolute top-2 right-2 bg-primary-500 text-white px-4 py-2 rounded'
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
