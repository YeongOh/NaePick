import SearchMain from '../components/SearchMain';

interface Props {
  searchParams: {
    sort?: 'latest' | 'popular';
    query?: string;
    category?: string;
  };
}

export default async function Page({ searchParams }: Props) {
  return (
    <>
      <SearchMain
        sort={searchParams.sort || 'popular'}
        query={searchParams.query}
        category={searchParams.category}
      />
    </>
  );
}
