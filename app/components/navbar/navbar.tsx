import { getSession } from '@/app/lib/session';
import Link from 'next/link';
import NavbarLink from './navbar-link';
import NavbarProfileImage from './navbar-profile-image';
import LinkButton from '../ui/link-button';
import { Menu, Trophy } from 'lucide-react';

interface Props {
  screenMode?: boolean;
}

export default async function Navbar({ screenMode }: Props) {
  const session = await getSession();

  return (
    <nav
      className={`gap-4 p-2 ${
        screenMode ? 'border-0 bg-[#0f0f0f]' : 'border-b-1 border border-l-0 border-r-0 border-t-0'
      }`}
    >
      <div className="m-auto flex max-w-screen-2xl items-center justify-between">
        <div className="flex items-center">
          <Link
            className={`flex items-center text-lg font-bold lg:text-2xl ${
              screenMode ? 'text-primary-300' : 'text-primary-500'
            }`}
            href={'/'}
          >
            <Trophy className="mr-1" />
            NaePick
          </Link>
        </div>
        <div
          className={`flex items-center gap-4 text-base font-semibold text-slate-600 ${
            screenMode ? 'text-white/90' : 'text-primary-500'
          }`}
        >
          <div className="hidden w-36 lg:flex">
            <LinkButton
              className={screenMode ? 'text-slate-300' : ''}
              href={`/wc/create`}
              variant={session?.userId ? 'primary' : 'ghost'}
              size="small"
            >
              이상형 월드컵 만들기
            </LinkButton>
          </div>
          {session?.userId ? (
            <>
              <NavbarProfileImage
                userId={session.userId}
                profilePath={session.profilePath}
                nickname={session.nickname}
              />
            </>
          ) : (
            <>
              <div className="flex w-16 lg:w-24">
                <LinkButton href={`/auth/login`} variant="primary" size="small">
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
