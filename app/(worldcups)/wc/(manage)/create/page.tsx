import WorldcupForm from '@/app/(worldcups)/wc/(manage)/components/WorldcupForm';
import { notFound } from 'next/navigation';
import Navbar from '@/app/components/navbar/navbar';
import { getAllCategories } from '@/app/lib/category/service';

export default async function Page() {
  const categories = await getAllCategories();

  if (!categories) notFound();

  return (
    <>
      <Navbar />
      <section className="max-w-xl m-auto flex flex-col mt-14">
        <WorldcupForm categories={categories} />
      </section>
    </>
  );
}