import { getSession } from '@/app/lib/actions/session';
import {
  fetchAllCategories,
  fetchCandidatesByPostId,
  fetchPostByPostId,
  fetchPostThumbnailByPostId,
} from '@/app/lib/data';
import UpdatePostForm from '@/app/ui/posts/UpdatePostForm';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string };
}

export default async function Page({ params }: Props) {
  const postId = params.id;
  const [postResult, candidates, session, categories] = await Promise.all([
    await fetchPostThumbnailByPostId(postId),
    await fetchCandidatesByPostId(postId),
    await getSession(),
    await fetchAllCategories(),
  ]);

  if (!postResult || !postResult[0] || !candidates) notFound();

  if (postResult[0].userId !== session.id)
    return <div>수정할 권한이 없습니다.</div>;

  return (
    <UpdatePostForm
      post={postResult[0]}
      candidates={candidates}
      categories={categories}
    />
  );
}
