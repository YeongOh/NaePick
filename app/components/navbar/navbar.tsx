import { getSession } from '@/app/lib/actions/session';
import Link from 'next/link';
import SignoutButtion from '../auth/signout-button';
import NavbarLink from './navbar-link';

interface Props {
  screenMode?: boolean;
}

export default async function Navbar({ screenMode }: Props) {
  const session = await getSession();

  return (
    <nav
      className={`p-4 gap-4 ${
        screenMode
          ? 'bg-[#0f0f0f] border-0'
          : 'border border-t-0 border-l-0 border-r-0 border-b-1'
      }`}
    >
      <div className='flex items-center justify-between max-w-screen-2xl m-auto'>
        <Link href={'/'}>
          <div
            className={`font-bold text-2xl ${
              screenMode ? 'text-primary-300' : 'text-primary-500'
            }`}
          >
            NaePick
          </div>
        </Link>
        <div
          className={`flex gap-4 items-center text-base font-semibold text-slate-600 ${
            screenMode ? 'text-white/90' : 'text-primary-500'
          }`}
        >
          <NavbarLink href={`/category`}>카테고리</NavbarLink>
          <NavbarLink href={`/worldcups/create`}>
            이상형 월드컵 만들기
          </NavbarLink>
          {session?.userId ? (
            <>
              <NavbarLink href={`/worldcups/users/${session.userId}`}>
                내 이상형 월드컵 관리
              </NavbarLink>
              <NavbarLink href={'/update-user'}>회원정보 수정</NavbarLink>
              <SignoutButtion />
            </>
          ) : (
            <Link
              className='bg-primary-500 text-white font-semibold px-4 py-2 rounded'
              href={`/signin`}
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
