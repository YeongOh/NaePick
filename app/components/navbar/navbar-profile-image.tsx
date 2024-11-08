'use client';

import { useEffect, useState } from 'react';
import Avatar from '../ui/Avatar';
import NavbarDropdownMenu from './navbar-dropdown-menu';

interface Props {
  profilePath: string | null;
  nickname: string;
  userId: string;
}

export default function NavbarProfileImage({ profilePath, nickname, userId }: Props) {
  const [openDropdownMenu, setOpenDropdownMenu] = useState(false);

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.navbar-dropdown-menu') &&
      !target.closest('.navbar-dropdown-menu-toggle') &&
      !target.closest('.modal')
    ) {
      setOpenDropdownMenu(false);
    }
  };

  useEffect(() => {
    if (openDropdownMenu !== false) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdownMenu]);

  return (
    <div className="relative">
      <button
        type="button"
        className="rounded-full navbar-dropdown-menu-toggle font-normal hover:outline hover:outline-primary-500 active:outline-primary-700"
        onClick={() => setOpenDropdownMenu((prev) => !prev)}
      >
        <Avatar profilePath={profilePath} alt={nickname} size="medium" />
      </button>
      <NavbarDropdownMenu open={openDropdownMenu} userId={userId} />
    </div>
  );
}
