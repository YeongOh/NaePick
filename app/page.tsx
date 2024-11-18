import { notFound } from 'next/navigation';

import { getPopularWorldcups } from './(search)/action';
import Main from './components/main';
import Navbar from './components/navbar/navbar';

export default async function Home() {
  const result = await getPopularWorldcups({ cursor: null });

  if (!result) notFound();

  return (
    <>
      <Navbar />
      <Main worldcups={result.data} nextCursor={result.nextCursor} />
    </>
  );
}
