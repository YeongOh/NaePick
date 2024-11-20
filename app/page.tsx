import React from 'react';
import { notFound } from 'next/navigation';
import { getPopularWorldcups } from './(search)/action';
import MainContent from './components/MainContent';
import Navbar from './components/oldNavbar/navbar';

export default async function Home() {
  const result = await getPopularWorldcups({ cursor: null });

  if (!result) notFound();

  return (
    <React.Fragment>
      <Navbar />
      <section className="m-auto max-w-screen-2xl">
        <MainContent worldcups={result.data} nextCursor={result.nextCursor} />
      </section>
    </React.Fragment>
  );
}
