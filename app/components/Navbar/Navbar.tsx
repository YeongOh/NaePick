import clsx from 'clsx';
import { Trophy } from 'lucide-react';
import Link from 'next/link';
import { getSession } from '@/app/lib/session';
import NavbarAvatar from './NavbarAvatar';
import LinkButton from '../../ui/LinkButton';

interface Props {
  screenMode?: boolean;
}

export default async function Navbar({ screenMode }: Props) {
  const session = await getSession();

  return (
    <nav
      className={clsx(
        'gap-4 p-2',
        screenMode ? 'border-0 bg-[#0f0f0f]' : 'border-b-1 border border-l-0 border-r-0 border-t-0',
      )}
    >
      <div className="m-auto flex max-w-screen-2xl items-center justify-between">
        <Link
          className={clsx(
            'flex items-center gap-1 text-lg font-bold lg:text-2xl',
            screenMode ? 'text-primary-300' : 'text-primary-500',
          )}
          href={'/'}
        >
          <Trophy />
          NaePick
        </Link>
        <div
          className={clsx(
            'flex items-center gap-4 text-base font-semibold text-slate-600',
            screenMode ? 'text-white/90' : 'text-primary-500',
          )}
        >
          <div className="hidden w-36 lg:flex">
            <LinkButton
              className={clsx(screenMode && 'text-white/80 hover:bg-transparent active:bg-transparent')}
              href={`/wc/create`}
              variant={session?.userId ? 'primary' : 'ghost'}
              size="sm"
            >
              이상형 월드컵 만들기
            </LinkButton>
          </div>
          {session ? (
            <NavbarAvatar
              userId={session.userId}
              profilePath={session.profilePath}
              nickname={session.nickname}
              email={session.email}
            />
          ) : (
            <LinkButton href={`/auth/login`} variant="primary" size="sm">
              로그인
            </LinkButton>
          )}
        </div>
      </div>
    </nav>
  );
}
