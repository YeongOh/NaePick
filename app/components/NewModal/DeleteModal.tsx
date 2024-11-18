'use client';

import { createPortal } from 'react-dom';

import Button from '../ui/Button';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export default function DeleteModal({ open, onClose, onConfirm, title, description }: Props) {
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
                  <Button type="button" variant="outline" className="px-4 py-2" onClick={onClose}>
                    취소
                  </Button>
                  <Button type="button" variant="delete" className="px-4 py-2" onClick={onConfirm}>
                    삭제하기
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
