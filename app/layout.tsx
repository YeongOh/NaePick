import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import GoogleAnalyticsComponent from './lib/analytics/google';
import { ReactQueryClientProvider } from './lib/react-query';
import { DropdownProvider } from '../hooks/useDropdown';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '이상형 월드컵 NaePick, 내픽!',
  description: '오픈 준비중입니다!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={notoSansKr.className}>
        <DropdownProvider>
          <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
        </DropdownProvider>
        <Toaster />
        <GoogleAnalyticsComponent />
      </body>
    </html>
  );
}
