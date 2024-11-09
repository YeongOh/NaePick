import SearchMain from '../../components/SearchMain';

interface Props {
  searchParams: {
    sort?: 'latest' | 'popular';
  };
  params: { 'category-name': string };
}

export default async function Page({ searchParams, params }: Props) {
  const category = params['category-name'];

  return (
    <>
      <SearchMain sort={searchParams.sort || 'popular'} category={category} />
    </>
  );
}
