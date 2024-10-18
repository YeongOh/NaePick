import { getSession } from '@/app/lib/actions/session';
import {
  fetchAllCategories,
  fetchCandidatesByWorldcupId,
  fetchWorldcupWithThumbnailByWorldcupId,
} from '@/app/lib/data';
import UpdateWorldcupForm from '@/app/components/worldcups/update-worldcup-form';
import { notFound, redirect } from 'next/navigation';

interface Props {
  params: { 'worldcup-id': string };
}

export default async function Page({ params }: Props) {
  const postId = params['worldcup-id'];
  const [postResult, candidates, session, categories] = await Promise.all([
    fetchWorldcupWithThumbnailByWorldcupId(postId),
    fetchCandidatesByWorldcupId(postId),
    getSession(),
    fetchAllCategories(),
  ]);

  if (!postResult || !postResult[0] || !candidates) notFound();

  if (postResult[0].userId !== session.id) redirect('/forbidden');

  return (
    <div className='max-w-4xl m-auto'>
      <UpdateWorldcupForm
        post={postResult[0]}
        candidates={candidates}
        categories={categories}
      />
    </div>
  );
}
