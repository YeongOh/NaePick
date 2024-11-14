import { signout } from '@/app/(auth)/auth/signout/actions';
import { LogOut, SquarePlus, Trophy, UserRoundPen } from 'lucide-react';
import Link from 'next/link';
import { useDropdown } from '../hooks/useDropdown';

interface Props {
  open: boolean;
  userId: string;
}

export default function NavbarDropdownMenu({ open, userId }: Props) {
  const { toggleDropdown } = useDropdown();

  return (
    <>
      {open && (
        <div className="dropdown-menu z-50" onClick={(e) => e.stopPropagation()}>
          <ul className="font-lg absolute right-0 z-50 flex w-52 animate-modalTransition cursor-pointer flex-col rounded-lg border bg-white p-2 text-left text-base font-semibold text-slate-700 shadow">
            <Link
              href="/wc/create"
              className="dropdown-button my-0.5 flex items-center gap-2 rounded p-2 text-primary-700 hover:bg-primary-100 active:bg-primary-200"
              onClick={() => toggleDropdown('avatar-dropdown')}
            >
              <SquarePlus />
              이상형 월드컵 만들기
            </Link>
            <Link
              href={`/wc/users/${userId}`}
              className="dropdown-button my-0.5 flex items-center gap-2 rounded p-2 hover:bg-primary-100 active:bg-primary-200"
              onClick={() => toggleDropdown('avatar-dropdown')}
            >
              <Trophy size="1.5rem" />
              나의 이상형 월드컵
            </Link>
            <Link
              href={'/auth/edit'}
              className="dropdown-button my-0.5 flex items-center gap-2 rounded p-2 hover:bg-primary-100 active:bg-primary-200"
              onClick={() => toggleDropdown('avatar-dropdown')}
            >
              <UserRoundPen size="1.5rem" />
              회원정보 관리
            </Link>
            <button
              onClick={() => {
                signout();
                toggleDropdown('avatar-dropdown');
              }}
              className="dropdown-button flex items-center gap-2 rounded p-2 text-left hover:bg-primary-100 active:bg-primary-200"
            >
              <LogOut size="1.5rem" /> 로그아웃
            </button>
          </ul>
        </div>
      )}
    </>
  );
}
