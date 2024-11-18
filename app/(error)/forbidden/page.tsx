import Link from 'next/link';

export default function Page() {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="lg:text-9xl mb-4 text-7xl font-extrabold tracking-tight text-primary-600 dark:text-primary-500">
            403
          </h1>
          <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
            해당 주소에 대한 권한이 없습니다.
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            죄송합니다. 홈으로 돌아가시겠습니까?
          </p>
          <Link
            href="/"
            className="my-4 inline-flex rounded-lg bg-primary-600 px-5 py-2.5 text-center font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
          >
            돌아가기
          </Link>
        </div>
      </div>
    </section>
  );
}
