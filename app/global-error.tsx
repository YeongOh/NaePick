'use client';

import Button from './ui/Button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <section className="m-auto max-w-screen-2xl">
          <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
            <div className="mx-auto flex max-w-screen-sm flex-col items-center justify-center text-center">
              <p className="mb-4 text-xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
                서버의 문제로 페이지를 불러오지 못했습니다.
              </p>
              <div className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                다시 시도하시겠습니까?
              </div>
              <div className="my-4 flex w-24 items-center justify-center">
                <Button onClick={() => reset()} variant="primary" size="md">
                  다시 시도
                </Button>
              </div>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}
