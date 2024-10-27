import { getAllCategories } from '@/app/lib/data/worldcups';
import CreateWorldcupForm from '@/app/components/worldcups/create-worldcup-form';
import WorldcupFormTab from '@/app/components/worldcups/worldcup-form-tab';
import { notFound } from 'next/navigation';

export default async function Page() {
  const categories = await getAllCategories();

  if (!categories) notFound();

  return (
    <div className='max-w-screen-md w-screen m-auto'>
      <WorldcupFormTab
        worldcupId={null}
        disabled={'candidates'}
        highlight='info'
      />
      <CreateWorldcupForm categories={categories} />
    </div>
  );
}
