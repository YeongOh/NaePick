import { fetchAllCategories } from '@/app/lib/data';
import CreateWorldcupForm from '@/app/components/worldcups/create-worldcup-form';

export default async function Page() {
  const categories = await fetchAllCategories();

  return (
    <div className='max-w-screen-md w-screen m-auto'>
      <CreateWorldcupForm categories={categories} />
    </div>
  );
}
