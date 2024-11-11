import { signout } from '@/app/(auth)/auth/signout/actions';
import { LogOut, SquarePlus, Trophy, UserRoundPen } from 'lucide-react';
import Link from 'next/link';

interface Props {
  open: boolean;
  userId: string;
}

export default function NavbarDropdownMenu({ open, userId }: Props) {
  return (
    <>
      {open && (
        <div className="navbar-dropdown-menu z-50" onClick={(e) => e.stopPropagation()}>
          <ul className="absolute right-0 font-lg border bg-white rounded-lg flex flex-col w-52 text-left text-base shadow cursor-pointer text-slate-700 p-2 z-50 animate-modalTransition font-semibold">
            <Link
              href="/wc/create"
              className="dropdown-button p-2 my-0.5 text-primary-700 hover:bg-primary-100 flex items-center gap-2 rounded active:bg-primary-200"
            >
              <SquarePlus />
              이상형 월드컵 만들기
            </Link>
            <Link
              href={`/wc/users/${userId}`}
              className="dropdown-button p-2 my-0.5 hover:bg-primary-100 flex items-center gap-2 rounded active:bg-primary-200"
            >
              <Trophy size="1.5rem" />
              나의 이상형 월드컵
            </Link>
            <Link
              href={'/auth/edit'}
              className="dropdown-button p-2 my-0.5 hover:bg-primary-100 flex items-center gap-2 rounded active:bg-primary-200"
            >
              <UserRoundPen size="1.5rem" />
              회원정보 관리
            </Link>
            <button
              onClick={() => signout()}
              className="dropdown-button p-2 hover:bg-primary-100 text-left flex items-center gap-2 rounded active:bg-primary-200"
            >
              <LogOut size="1.5rem" /> 로그아웃
            </button>
          </ul>
        </div>
      )}
    </>
  );
}
