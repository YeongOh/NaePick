import { LogOut, SquarePlus, Star, Trophy } from 'lucide-react';
import Link from 'next/link';
import { signout } from '@/app/(auth)/auth/signout/actions';
import { useDropdown } from '@/app/hooks/useDropdown';
import Avatar from '@/app/ui/Avatar';

interface Props {
  open: boolean;
  profilePath: string | null;
  nickname: string;
  userId: string;
  email: string;
}

export default function NavbarDropdownMenu({ open, profilePath, nickname, userId, email }: Props) {
  const { toggleDropdown } = useDropdown();

  function handleToggleDropdown() {
    toggleDropdown('avatar-dropdown');
  }

  return (
    <>
      {open && (
        <div className="dropdown-menu z-50" onClick={(e) => e.stopPropagation()}>
          <ul className="font-lg absolute right-0 top-10 z-50 flex w-60 cursor-pointer flex-col rounded-lg border bg-white p-2 text-left text-base font-semibold text-slate-700 shadow">
            <Link
              href="/auth/edit"
              className="dropdown-button hover:bg-secondary-50 active:bg-secondary-100 group my-0.5 flex items-center gap-2 rounded border-b p-2"
              onClick={handleToggleDropdown}
            >
              <Avatar profilePath={profilePath} alt={nickname} size="sm" />
              <div className="flex flex-col gap-1 pl-1">
                <div>{nickname}</div>
                <div className="text-sm font-normal">{email}</div>
                <div className="text-secondary-500 font-normal group-hover:underline">회원정보 관리</div>
              </div>
            </Link>
            <Link
              href="/wc/create"
              className="dropdown-button hover:bg-secondary-50 active:bg-secondary-100 my-0.5 flex items-center gap-2 rounded p-2 text-primary-700"
              onClick={handleToggleDropdown}
            >
              <SquarePlus />
              이상형 월드컵 만들기
            </Link>
            <Link
              href={`/wc/users/${userId}`}
              className="dropdown-button hover:bg-secondary-50 active:bg-secondary-100 my-0.5 flex items-center gap-2 rounded p-2"
              onClick={handleToggleDropdown}
            >
              <Trophy size="1.5rem" />
              나의 이상형 월드컵
            </Link>
            <Link
              href={`/wc/favourites`}
              className="dropdown-button hover:bg-secondary-50 active:bg-secondary-100 my-0.5 flex items-center gap-2 rounded p-2"
              onClick={handleToggleDropdown}
            >
              <Star size="1.5rem" />
              즐겨찾기한 이상형 월드컵
            </Link>
            <button
              onClick={() => {
                signout();
                handleToggleDropdown();
              }}
              className="dropdown-button hover:bg-secondary-50 active:bg-secondary-100 flex items-center gap-2 rounded p-2 text-left"
            >
              <LogOut size="1.5rem" /> 로그아웃
            </button>
          </ul>
        </div>
      )}
    </>
  );
}
