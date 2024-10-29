import MyImage from '@/app/components/ui/my-image/my-image';
import { createPortal } from 'react-dom';

interface Props {
  open: boolean;
  onClose: () => void;
  src: string;
  alt: string;
}

export default function Preview({ src, alt, open, onClose }: Props) {
  return (
    <>
      {open &&
        createPortal(
          <div
            className='fixed inset-0 z-99 bg-black/80 w-screen h-screen'
            onClick={onClose}
          >
            <div className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
              <MyImage src={src} alt={alt} />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
