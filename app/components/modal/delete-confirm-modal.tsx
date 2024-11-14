'use client';

import { createPortal } from 'react-dom';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export default function DeleteConfirmModal({ open, onClose, onConfirm, title, description }: Props) {
  return (
    <>
      {open &&
        createPortal(
          <div
            className="modal fixed inset-0 z-50 h-screen w-screen bg-black/80"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-0 m-auto h-fit w-[420px] max-w-[95%] animate-modalTransition rounded-xl border bg-white p-6"
            >
              <div className="flex flex-col justify-between">
                <h2 className="mb-4 text-lg font-semibold text-slate-700">{title}</h2>
                {description.length ? (
                  <p className="mb-2 h-[50px] text-base text-slate-500">{description}</p>
                ) : null}
                <div className="flex w-full justify-end gap-2">
                  <button
                    type="button"
                    className="rounded border px-4 py-2 text-center text-base text-slate-700 hover:bg-gray-50 active:bg-gray-100"
                    onClick={onClose}
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    className="rounded bg-red-500 px-4 py-2 text-center text-base font-semibold text-white transition-colors hover:bg-red-600 active:bg-red-700"
                    onClick={onConfirm}
                  >
                    삭제하기
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
