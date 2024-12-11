import { notFound, redirect } from 'next/navigation';
import UpdateContent from '@/app/(worldcups)/wc/users/[user-id]/components/UpdateContent';
import Navbar from '@/app/components/Navbar/Navbar';
import { getSession } from '@/app/lib/session';
import LinkButton from '@/app/ui/LinkButton';
import { getMyWorldcups } from './actions';

export const metadata = {
  title: '내 이상형 월드컵',
};

interface Props {
  params: { 'user-id': string };
  searchParams: {
    page: string;
  };
}

export default async function Page({ params, searchParams }: Props) {
  const userId = params['user-id'];
  const page = Number(searchParams.page) || 1;
  const [result, session] = await Promise.all([getMyWorldcups(userId, page), getSession()]);

  if (session?.userId !== userId) {
    redirect('/forbidden');
  }
  if (!result) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <section className="m-auto max-w-screen-2xl">
        {result.data.length ? (
          <UpdateContent count={result.count} page={page} worldcups={result.data} />
        ) : (
          <div className="mx-auto flex max-w-screen-sm flex-col items-center justify-center text-center">
            <p className="mb-4 mt-10 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              아직 만드신 이상형 월드컵이 없습니다.
            </p>
            <div className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
              이상형 월드컵을 만들어보세요.
            </div>
            <div className="flex w-36 flex-col items-center justify-center">
              <LinkButton href="/wc/create" variant="primary" size="md" className="my-2 w-full">
                만들기
              </LinkButton>
              <LinkButton href="/" variant="outline" size="md" className="w-full">
                돌아가기
              </LinkButton>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
