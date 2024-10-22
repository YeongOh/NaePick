import { fetchAllCategories } from '@/app/lib/data/worldcups';
import CreateWorldcupForm from '@/app/components/worldcups/create-worldcup-form';
import WorldcupFormTab from '@/app/components/worldcups/worldcup-form-tab';

export default async function Page() {
  const categories = await fetchAllCategories();

  return (
    <div className='max-w-screen-md w-screen m-auto'>
      <WorldcupFormTab worldcupId={null} disabled={'candidates'} />
      <CreateWorldcupForm categories={categories} />
    </div>
  );
}
