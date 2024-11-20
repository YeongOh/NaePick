'use client';

import { useDropdown } from '@/app/hooks/useDropdown';
import Avatar from '@/app/ui/Avatar';
import NavbarDropdownMenu from './NavbarDropdownMenu';

interface Props {
  profilePath: string | null;
  nickname: string;
  userId: string;
  email: string;
}

export default function NavbarAvatar({ profilePath, nickname, userId, email }: Props) {
  const { dropdownId, toggleDropdown } = useDropdown();

  return (
    <div className="relative flex items-center justify-center">
      <button
        type="button"
        className="dropdown-menu-toggle rounded-full font-normal hover:outline hover:outline-primary-500 active:outline-primary-700"
        onClick={() => toggleDropdown('avatar-dropdown')}
      >
        <Avatar profilePath={profilePath} alt={nickname} size="sm" />
      </button>
      <NavbarDropdownMenu
        open={dropdownId === 'avatar-dropdown'}
        userId={userId}
        nickname={nickname}
        profilePath={profilePath}
        email={email}
      />
    </div>
  );
}
