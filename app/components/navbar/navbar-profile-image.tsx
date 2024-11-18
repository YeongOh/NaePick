'use client';

import NavbarDropdownMenu from './navbar-dropdown-menu';
import { useDropdown } from '../../../hooks/useDropdown';
import Avatar from '../ui/Avatar';

interface Props {
  profilePath: string | null;
  nickname: string;
  userId: string;
  email: string;
}

export default function NavbarProfileImage({ profilePath, nickname, userId, email }: Props) {
  const { dropdownId, toggleDropdown } = useDropdown();

  return (
    <div className="relative">
      <button
        type="button"
        className="dropdown-menu-toggle rounded-full font-normal hover:outline hover:outline-primary-500 active:outline-primary-700"
        onClick={() => toggleDropdown('avatar-dropdown')}
      >
        <Avatar profilePath={profilePath} alt={nickname} size="small" />
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
