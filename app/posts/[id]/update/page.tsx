import { getSession } from '@/app/lib/actions/session';
import {
  fetchAllCategories,
  fetchCandidatesByPostId,
  fetchPostByPostId,
  fetchPostWithThumbnailInfoByPostId,
} from '@/app/lib/data';
import UpdatePostForm from '@/app/ui/posts/UpdatePostForm';
import { notFound, redirect } from 'next/navigation';

interface Props {
  params: { id: string };
}

export default async function Page({ params }: Props) {
  const postId = params.id;
  const [postResult, candidates, session, categories] = await Promise.all([
    fetchPostWithThumbnailInfoByPostId(postId),
    fetchCandidatesByPostId(postId),
    getSession(),
    fetchAllCategories(),
  ]);

  if (!postResult || !postResult[0] || !candidates) notFound();

  if (postResult[0].userId !== session.id) redirect('/error/forbidden');

  return (
    <div className='max-w-4xl m-auto'>
      <UpdatePostForm
        post={postResult[0]}
        candidates={candidates}
        categories={categories}
      />
    </div>
  );
}
