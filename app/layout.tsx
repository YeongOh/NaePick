import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import SignoutButtion from './ui/auth/SignoutButton';
import { getSession } from './lib/actions/session';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '이상형 월드컵 Pick',
  description: '설명 준비중',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  console.log(session);

  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className='flex flex-col'>
          <div className='flex p-4 gap-4'>
            <Link href={'/'}>
              <h1>Pick</h1>
            </Link>
            <Link href={`/posts/create`}>월드컵 만들기</Link>
            {session?.username ? (
              <SignoutButtion />
            ) : (
              <Link href={`/auth/signin`}>로그인</Link>
            )}
          </div>
          <div className='flex-grow md:overflow-y-auto'>{children}</div>
        </div>
      </body>
    </html>
  );
}
