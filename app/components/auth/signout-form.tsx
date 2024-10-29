'use client';

import { signout } from '@/app/lib/actions/auth/signout';
import Link from 'next/link';
import Button from '../ui/button';

export default function SignoutForm() {
  return (
    <div className='rounded-md flex flex-col w-full -translate-y-1/4'>
      <Link
        href='/'
        className='text-primary-500 text-5xl text-center m-4 font-extrabold'
      >
        NaePick
      </Link>
      <p className='text-center text-base mb-2 text-slate-700'>
        해당 서비스를 이용하려면 로그아웃이 필요합니다.
      </p>
      <p className='text-center text-lg font-semibold mb-6 text-slate-700'>
        로그아웃 하시겠습니까?
      </p>
      <Button variant='outline' className='mb-2'>
        로그아웃
      </Button>
      <Link
        href='/'
        className='w-full text-center text-white font-semibold py-3 px-2 rounded bg-primary-500 hover:bg-primary-700 transition-colors'
      >
        돌아가기
      </Link>
    </div>
  );
}
