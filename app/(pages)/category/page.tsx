import { getAllCategories } from '@/app/lib/data/worldcups';
import { notFound } from 'next/navigation';
import Navbar from '@/app/components/navbar/navbar';
import CategoryMain from '@/app/components/category/category-main';

export default async function Page() {
  const [categories] = await Promise.all([getAllCategories()]);

  if (!categories) {
    notFound();
  }
  console.log(categories);

  return (
    <>
      <Navbar />
      <CategoryMain categories={categories} />
    </>
  );
}
