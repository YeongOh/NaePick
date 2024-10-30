'use client';

import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
}: Props) {
  return (
    <>
      {open &&
        createPortal(
          <div
            className='modal fixed inset-0 z-50 bg-black/80 w-screen h-screen'
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border bg-white rounded-xl p-6 min-w-[400px] animate-modalTransition'
            >
              <div className='flex flex-col justify-between'>
                <h2 className='text-lg font-semibold text-slate-700 mb-4'>
                  {title}
                </h2>
                <p className='text-base text-slate-500 h-[50px]'>
                  {description}
                </p>
                <div className='flex w-full gap-2 justify-end'>
                  <button
                    className='text-primary-500 text-base px-4 py-2 text-center border rounded'
                    onClick={onClose}
                  >
                    취소
                  </button>
                  <button
                    className='text-base font-semibold bg-red-500 text-center text-white px-4 py-2 rounded'
                    onClick={onConfirm}
                  >
                    삭제하기
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
