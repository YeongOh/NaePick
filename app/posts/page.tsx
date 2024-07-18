'use client';

import Image from 'next/image';

export default function Page() {
  return (
    <div className='flex bg-black'>
      <Image
        className='w-1/2 h-auto cursor-pointer'
        src='/geto.jpg'
        alt='geto'
        width={0}
        height={0}
        sizes='100vw'
      />
      <Image
        className='w-1/2 h-auto cursor-pointer'
        src='/gojo.webp'
        alt='gojo'
        width={0}
        height={0}
        sizes='100vw'
      />
      {/* <img src='/gojo.webp' alt='gojo' /> */}
    </div>
  );
}
