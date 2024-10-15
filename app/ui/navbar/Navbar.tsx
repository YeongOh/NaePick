import { getSession } from '@/app/lib/actions/session';
import Link from 'next/link';
import SignoutButtion from '../auth/SignoutButton';
import NavbarLink from './NavbarLink';

export default async function Navbar() {
  const session = await getSession();

  return (
    <nav className='p-4 gap-4 border border-b-1'>
      <div className='flex items-center justify-between max-w-screen-2xl m-auto'>
        <Link href={'/'}>
          <h1 className='font-bold text-2xl'>YoPick</h1>
        </Link>
        <div className='flex gap-4 items-center'>
          <NavbarLink href={`/posts/create`} pathToHighlight={`/posts/create`}>
            월드컵 만들기
          </NavbarLink>
          {session?.username ? (
            <>
              <NavbarLink
                href={`/${session.id}`}
                pathToHighlight={`/${session.id}`}
              >
                내 월드컵 관리
              </NavbarLink>
              <NavbarLink
                href={'/auth/update'}
                pathToHighlight={'/auth/update'}
              >
                회원정보 수정
              </NavbarLink>
              <SignoutButtion />
            </>
          ) : (
            <Link
              className='bg-primary-500 text-white font-semibold px-4 py-2 rounded'
              href={`/auth/signin`}
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
