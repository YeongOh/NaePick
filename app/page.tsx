import Navbar from './components/navbar/navbar';
import { notFound } from 'next/navigation';
import Main from './components/main';
import { getWorldcups } from './lib/worldcup/service';

export default async function Home() {
  const result = await getWorldcups();

  if (!result) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <Main initialWorldcupCards={result.data} params="popular" nextCursor={result.nextCursor} />
    </>
  );
}
