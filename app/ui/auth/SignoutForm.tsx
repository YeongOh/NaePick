'use client';

import { signout } from '@/app/lib/actions/auth/signout';

export default function SignoutForm() {
  return (
    <div className='rounded-md bg-gray-50 p-6'>
      <div className='text-center font-semibold mb-4 text-lg'>
        해당 서비스를 이용하기 위해서는 로그아웃이 필요합니다.
      </div>
      <div className='text-center mb-4 text-lg'>로그아웃 하시겠습니까?</div>
      <div className='flex gap-4 m-4 items-center justify-center'>
        <button className='bg-teal-500 px-4 flex h-12 items-center rounded-lg text-white font-semibold'>
          돌아가기
        </button>
        <button
          onClick={() => signout()}
          className='bg-gray-100 px-4 flex h-12 items-center rounded-lg font-semibold text-gray-600 border border-slate-600'
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
