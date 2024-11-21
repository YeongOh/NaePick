import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { DropdownProvider } from './hooks/useDropdown';
import GoogleAnalyticsComponent from './lib/analytics/google';
import { ReactQueryClientProvider } from './lib/react-query';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | 이상형 월드컵 NaePick, 내픽!',
    default: '이상형 월드컵 NaePick, 내픽!',
  },
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
