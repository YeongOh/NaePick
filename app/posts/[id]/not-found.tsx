import Link from 'next/link';

export default function NotFound() {
  return (
    <main>
      없어요
      <Link href='/posts'>돌아가기</Link>
    </main>
  );
}
