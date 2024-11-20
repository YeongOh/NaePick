'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface DropdownContextType {
  dropdownId: string | null;
  toggleDropdown: (id: string | null) => void;
  setDropdownId: (id: string | null) => void;
}

const DropdownContext = createContext<DropdownContextType | null>(null);

export const DropdownProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dropdownId, setDropdownId] = useState<string | null>(null);

  const toggleDropdown = (id: string | null) => {
    setDropdownId((prev) => (prev === id ? null : id));
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.dropdown-menu') &&
      !target.closest('.dropdown-menu-toggle') &&
      !target.closest('.modal')
    ) {
      setDropdownId(null);
    }
  };

  useEffect(() => {
    if (dropdownId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownId]);

  return (
    <DropdownContext.Provider value={{ dropdownId, setDropdownId, toggleDropdown }}>
      {children}
    </DropdownContext.Provider>
  );
};

export const useDropdown = (): DropdownContextType => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Out of Dropdown provider');
  }
  return context;
};
