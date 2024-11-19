import Navbar from '@/app/components/oldNavbar/navbar';

export default function ErrorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
