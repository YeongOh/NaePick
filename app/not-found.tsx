import Link from 'next/link';

export default function NotFound() {
  return (
    <main>
      <section className='bg-white dark:bg-gray-900'>
        <div className='py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6'>
          <div className='mx-auto max-w-screen-sm text-center'>
            <h1 className='mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-teal-600 dark:text-teal-500'>
              404
            </h1>
            <p className='mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white'>
              페이지를 찾을 수 없습니다.
            </p>
            <p className='mb-4 text-lg font-light text-gray-500 dark:text-gray-400'>
              죄송합니다. 해당 페이지를 찾을 수 없습니다.
            </p>
            <a
              href='/'
              className='inline-flex text-white bg-teal-600 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg px-5 py-2.5 text-center dark:focus:ring-teal-900 my-4'
            >
              돌아가기
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
