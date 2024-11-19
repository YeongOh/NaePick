'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Button from '@/app/ui/Button';

import { signout } from '../actions';

export default function SignoutForm() {
  const router = useRouter();

  return (
    <div className="flex w-full -translate-y-1/4 flex-col rounded-md">
      <Link href="/" className="m-4 text-center text-5xl font-extrabold text-primary-500">
        NaePick
      </Link>
      <p className="mb-2 text-center text-base text-slate-700">
        해당 서비스를 이용하려면 로그아웃이 필요합니다.
      </p>
      <p className="mb-6 text-center text-lg font-semibold text-slate-700">로그아웃 하시겠습니까?</p>
      <Button
        type="button"
        onClick={() => router.back()}
        variant="primary"
        className="mb-2 w-full"
        role="link"
      >
        돌아가기
      </Button>
      <Button onClick={() => signout()} variant="outline" className="w-full">
        로그아웃
      </Button>
    </div>
  );
}
