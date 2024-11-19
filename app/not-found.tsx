import Navbar from './components/oldNavbar/navbar';
import LinkButton from './components/ui/LinkButton';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
          <div className="mx-auto flex max-w-screen-sm flex-col items-center justify-center text-center">
            <h1 className="lg:text-9xl mb-4 text-7xl font-extrabold tracking-tight text-primary-600 dark:text-primary-500">
              404
            </h1>
            <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
              페이지를 찾을 수 없습니다.
            </p>
            <div className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
              홈으로 돌아가시겠습니까?
            </div>
            <div className="my-4 flex w-24 items-center justify-center">
              <LinkButton href="/" variant="primary" size="md">
                돌아가기
              </LinkButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
