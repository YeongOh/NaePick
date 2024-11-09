'use client';

import Button from '@/app/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signout } from '../actions';

export default function SignoutForm() {
  const router = useRouter();

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
      <Button
        type='button'
        onClick={() => router.back()}
        variant='primary'
        className='mb-2'
        aria-label='Go back'
        role='link'
      >
        돌아가기
      </Button>
      <Button onClick={() => signout()} variant='outline' className=''>
        로그아웃
      </Button>
    </div>
  );
}