import { notFound } from 'next/navigation';
import WorldcupForm from '@/app/(worldcups)/wc/(manage)/components/WorldcupForm';
import { getCategories } from '@/app/lib/category/service';

export const metadata = {
  title: '이상형 월드컵 만들기',
};

export default async function Page() {
  const categories = await getCategories();

  if (!categories) notFound();

  return (
    <>
      <section className="m-auto mt-14 flex max-w-2xl flex-col">
        <WorldcupForm categories={categories} />
      </section>
    </>
  );
}
