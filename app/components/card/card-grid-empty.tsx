import { useRouter } from 'next/navigation';
import OldButton from '../ui/OldButton/OldButton';
import LinkButton from '../ui/link-button';

export default function CardGridEmpty() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
      <div className="mx-auto flex max-w-screen-sm flex-col items-center justify-center text-center">
        <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
          이상형 월드컵을 찾지 못했습니다.
        </p>
        <div className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">직접 만들어 보세요!</div>
        <div className="flex w-48 flex-col">
          <LinkButton href="/wc/create" variant="primary" size="medium" className="mb-2">
            이상형 월드컵 만들기{' '}
          </LinkButton>
          <OldButton onClick={() => router.back()} variant="outline" size="medium">
            돌아가기
          </OldButton>
        </div>
      </div>
    </div>
  );
}
