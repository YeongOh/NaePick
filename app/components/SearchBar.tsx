'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useQueryString from '@/app/hooks/useQueryString';
import Button from '../ui/Button';

export default function Searchbar() {
  const { createQueryString } = useQueryString();
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimQuery = query.trim();
    if (!trimQuery.length) {
      return;
    }
    router.push('/search?' + createQueryString('query', trimQuery));
  };

  return (
    <form onSubmit={handleSearch} className="relative flex flex-1 items-center">
      <div className="relative w-full md:max-w-[32rem]">
        <input
          id="search"
          className={clsx(
            'h-9 w-full rounded-md border border-gray-200 px-3 py-1.5 text-base text-slate-700 placeholder:text-gray-500 focus:outline-primary-500 sm:visible',
            expanded ? 'visible' : 'invisible',
          )}
          type="text"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="제목 혹은 이름으로 검색해보세요!"
        />
        <Button
          variant="primary"
          size="icon"
          onClick={() => setExpanded((prev) => !prev)}
          className="absolute right-0 top-0 h-9 w-9 sm:rounded-bl-none sm:rounded-tl-none"
        >
          <Search className="text-white" size="1.2rem" />
        </Button>
      </div>
    </form>
  );
}
