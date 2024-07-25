import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col'>
      <div className='flex p-4 gap-4'>
        <Link href={'/posts'}>
          <h1>Pick</h1>
        </Link>
        <Link href={`/posts/create`}>월드컵 만들기</Link>
        <div>내 월드컵</div>
        <div>좋아요한 월드컵</div>
        <div>즐겨찾기한 월드컵</div>
        <div>검색</div>
      </div>
      <div className='flex-grow md:overflow-y-auto'>{children}</div>
    </div>
  );
}
