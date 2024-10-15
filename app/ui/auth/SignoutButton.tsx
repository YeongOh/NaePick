'use client';

import { signout } from '@/app/lib/actions/auth/signout';

export default function SignoutButtion() {
  return <button onClick={() => signout()}>로그아웃</button>;
}
