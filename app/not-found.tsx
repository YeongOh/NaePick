import Link from 'next/link';
import Navbar from './components/navbar/navbar';
import LinkButton from './components/ui/link-button';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <section className='bg-white dark:bg-gray-900'>
        <div className='py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6'>
          <div className='mx-auto max-w-screen-sm text-center'>
            <h1 className='mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500'>
              404
            </h1>
            <p className='mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white'>
              페이지를 찾을 수 없습니다.
            </p>
            <div className='mb-4 text-lg font-light text-gray-500 dark:text-gray-400'>
              죄송합니다. 홈으로 돌아가시겠습니까?
            </div>
            <div className='my-4 w-full flex justify-center items-center'>
              <LinkButton
                href='/'
                variant='primary'
                size='large'
                className='block w-24'
              >
                돌아가기
              </LinkButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
