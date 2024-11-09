import Navbar from './components/navbar/navbar';
import { notFound } from 'next/navigation';
import Main from './components/main';
import { getPopularWorldcups } from './(worldcups)/wc/[worldcup-id]/actions';

export default async function Home() {
  const result = await getPopularWorldcups();

  if (!result) notFound();

  return (
    <>
      <Navbar />
      <Main worldcups={result.data} nextCursor={result.nextCursor} />
    </>
  );
}
