import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './ui/navbar/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '이상형 월드컵 Pick',
  description: '설명 준비중',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className='flex flex-col'>
          <Navbar />
          <div className='flex-grow md:overflow-y-auto'>{children}</div>
        </div>
      </body>
    </html>
  );
}
