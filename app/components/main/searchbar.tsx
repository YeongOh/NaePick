'use client';

import { useCallback, useState } from 'react';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Searchbar() {
  const [query, setQuery] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

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
      <div className="relative w-full lg:max-w-[32rem]">
        <input
          id="search"
          className="h-9 w-full rounded-bl rounded-tl border border-gray-200 px-3 py-1.5 text-base text-slate-700 placeholder:text-gray-500 focus:outline-primary-500"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="제목 혹은 이름으로 검색해보세요!"
        />
        <button className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-br rounded-tr bg-primary-500 p-2">
          <Search className="text-white" size="1.2rem" />
        </button>
      </div>
    </form>
  );
}
