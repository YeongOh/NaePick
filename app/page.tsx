import Navbar from './components/navbar/navbar';
import { notFound } from 'next/navigation';
import Main from './components/main';
import { getPopularWorldcups } from './(search)/action';
import { ReactQueryClientProvider } from './lib/react-query';

export default async function Home() {
  const result = await getPopularWorldcups();

  if (!result) notFound();

  return (
    <ReactQueryClientProvider>
      <Navbar />
      <Main worldcups={result.data} nextCursor={result.nextCursor} />
    </ReactQueryClientProvider>
  );
}
