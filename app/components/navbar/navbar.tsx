import { getSession } from '@/app/lib/actions/session';
import Link from 'next/link';
import NavbarLink from './navbar-link';
import NavbarProfileImage from './navbar-profile-image';
import LinkButton from '../ui/link-button';
import { Pickaxe } from 'lucide-react';

interface Props {
  screenMode?: boolean;
}

export default async function Navbar({ screenMode }: Props) {
  const session = await getSession();

  return (
    <nav
      className={`p-1 gap-4 ${
        screenMode
          ? 'bg-[#0f0f0f] border-0'
          : 'border border-t-0 border-l-0 border-r-0 border-b-1'
      }`}
    >
      <div className='flex items-center justify-between max-w-screen-2xl m-auto'>
        <div className='flex items-center gap-8'>
          <Link
            className={`flex items-center font-bold text-2xl ${
              screenMode ? 'text-primary-300' : 'text-primary-500'
            }`}
            href={'/'}
          >
            <Pickaxe className='mr-1' />
            NaePick
          </Link>
          <NavbarLink href='/category'>카테고리</NavbarLink>
        </div>
        <div
          className={`flex gap-4 items-center text-base font-semibold text-slate-600 ${
            screenMode ? 'text-white/90' : 'text-primary-500'
          }`}
        >
          <div className='w-36 flex'>
            <LinkButton
              href={`/worldcups/create`}
              variant={session?.userId ? 'primary' : 'ghost'}
              size='small'
            >
              이상형 월드컵 만들기
            </LinkButton>
          </div>
          {session?.userId ? (
            <>
              <NavbarProfileImage
                userId={session.userId}
                profilePathname={session.profilePathname}
                nickname={session.nickname}
              />
            </>
          ) : (
            <>
              <div className='w-24 flex'>
                <LinkButton href={`/signin`} variant='primary' size='small'>
                  로그인
                </LinkButton>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
