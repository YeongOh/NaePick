'use client';

import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
}

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  children,
}: Props) {
  return (
    <>
      {open &&
        createPortal(
          <div
            className='fixed inset-0 z-99 bg-black/30 w-screen h-screen'
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border bg-white rounded-xl p-4 min-w-[350px]'
            >
              <div className='flex flex-col items-center justify-between'>
                <h2 className='flex items-center justify-center text-lg font-semibold m-4 text-slate-700 h-[100px]'>
                  {children}
                </h2>

                <div className='flex w-full gap-4'>
                  <button
                    className='flex-1 text-primary-500 text-base px-4 py-2 text-center'
                    onClick={onClose}
                  >
                    취소
                  </button>
                  <button
                    className='flex-1 text-base font-semibold bg-red-500 text-center text-white px-4 py-2 rounded'
                    onClick={onConfirm}
                  >
                    삭제
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
