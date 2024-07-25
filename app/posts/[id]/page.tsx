import { fetchCandidatesByPostId, fetchPostById } from '@/app/lib/data';
import PickScreen from '@/app/ui/posts/PickScreen';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string };
}

export default async function Page({ params }: Props) {
  const id = params.id;
  const [post, candidates]: any = await Promise.all([
    await fetchPostById(id),
    await fetchCandidatesByPostId(id),
  ]);

  if (!post[0]) {
    console.log(post[0]);
    notFound();
  }

  return (
    <>
      <PickScreen
        defaultCandidates={candidates}
        totalRounds={post[0].numberOfCandidates}
        title={post[0].title}
      />
      <p>{post[0].description}</p>
    </>
  );
}
