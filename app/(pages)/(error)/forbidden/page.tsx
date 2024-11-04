import Link from 'next/link';

export default function Page() {
  return (
    <section className='bg-white dark:bg-gray-900'>
      <div className='py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6'>
        <div className='mx-auto max-w-screen-sm text-center'>
          <h1 className='mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500'>
            403
          </h1>
          <p className='mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white'>
            해당 주소에 대한 권한이 없습니다.
          </p>
          <p className='mb-4 text-lg font-light text-gray-500 dark:text-gray-400'>
            죄송합니다. 홈으로 돌아가시겠습니까?
          </p>
          <Link
            href='/'
            className='inline-flex text-white bg-primary-600 hover:bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4'
          >
            돌아가기
          </Link>
        </div>
      </div>
    </section>
  );
}
