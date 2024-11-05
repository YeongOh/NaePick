import { getAllCategories } from '@/app/lib/data/worldcups';
import CreateWorldcupForm from '@/app/components/worldcups/create-worldcup-form';
import { notFound } from 'next/navigation';
import Navbar from '@/app/components/navbar/navbar';

export default async function Page() {
  const categories = await getAllCategories();

  if (!categories) notFound();

  return (
    <>
      <Navbar />
      <section className='max-w-xl m-auto flex flex-col'>
        <CreateWorldcupForm categories={categories} />
      </section>
    </>
  );
}
