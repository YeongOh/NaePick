'use client';

import { useDropdown } from '../hooks/useDropdown';
import Avatar from '../ui/Avatar';
import NavbarDropdownMenu from './navbar-dropdown-menu';

interface Props {
  profilePath: string | null;
  nickname: string;
  userId: string;
}

export default function NavbarProfileImage({ profilePath, nickname, userId }: Props) {
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
      <NavbarDropdownMenu open={dropdownId === 'avatar-dropdown'} userId={userId} />
    </div>
  );
}
