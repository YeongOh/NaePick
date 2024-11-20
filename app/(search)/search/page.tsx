import SearchContent from './components/SearchContent';

interface Props {
  searchParams: {
    sort?: 'latest' | 'popular';
    query?: string;
    category?: string;
  };
}

export default async function Page({ searchParams }: Props) {
  return (
    <section className="m-auto max-w-screen-2xl">
      <SearchContent
        sort={searchParams.sort || 'popular'}
        query={searchParams.query}
        category={searchParams.category}
      />
    </section>
  );
}
