import { fetchAllCategories } from '@/app/lib/data';
import CreatePostForm from '@/app/ui/posts/CreatePostForm';

export default async function Page() {
  const categories = await fetchAllCategories();

  return (
    <div className='max-w-screen-md w-screen m-auto'>
      <CreatePostForm categories={categories} />
    </div>
  );
}
