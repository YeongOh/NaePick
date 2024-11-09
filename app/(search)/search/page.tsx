import SearchMain from './components/SearchMain';

interface Props {
  searchParams: {
    sort?: 'latest' | 'popular';
  };
}

export default async function Page({ searchParams }: Props) {
  return (
    <>
      <SearchMain sort={searchParams.sort || 'popular'} />
    </>
  );
}
