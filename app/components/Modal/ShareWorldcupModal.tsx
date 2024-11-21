'use client';

import { useEffect, useRef } from 'react';

import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';

import { DOMAIN } from '@/app/constants';
import Button from '../../ui/Button';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  worldcupId: string;
}

export default function ShareWorldcupModal({ open, title, onClose, worldcupId }: Props) {
  const focusedRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    focusedRef?.current?.select();
  }, [open]);

  const handleCopyShareLInk = async () => {
    await navigator.clipboard.writeText(`${DOMAIN}/wc/${worldcupId}`);
    toast.success('복사되었습니다.');
  };

  return (
    <>
      {open &&
        createPortal(
          <div
            className="modal fixed inset-0 z-50 h-screen w-screen bg-black/30"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-0 m-auto h-fit w-[420px] max-w-[95%] animate-modalTransition rounded-xl border bg-white p-4"
            >
              <h2 className="mb-4 text-center text-lg font-semibold">{title} 공유하기</h2>
              <div className="flex flex-col items-center justify-between">
                <div className="relative w-full overflow-hidden whitespace-nowrap rounded-lg border bg-gray-50 p-4 text-base">
                  <input
                    className="w-[80%] bg-gray-50 focus:outline-primary-500"
                    ref={focusedRef}
                    onBlur={() => {
                      focusedRef.current = null;
                    }}
                    defaultValue={`${DOMAIN}/wc/${worldcupId}`}
                    readOnly
                  />
                  <Button
                    onClick={handleCopyShareLInk}
                    variant="primary"
                    size="sm"
                    className="absolute right-2 top-2"
                  >
                    복사
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
