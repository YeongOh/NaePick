'use client';

import { signout } from '@/app/lib/actions/signout';

export default function SignoutButtion() {
  return <button onClick={() => signout()}>로그아웃</button>;
}
