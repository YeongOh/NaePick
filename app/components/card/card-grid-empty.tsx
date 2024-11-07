import { useRouter } from 'next/navigation';
import Button from '../ui/button';
import LinkButton from '../ui/link-button';

export default function CardGridEmpty() {
  const router = useRouter();

  return (
    <div className='py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6'>
      <div className='flex flex-col mx-auto justify-center items-center max-w-screen-sm text-center'>
        <p className='mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white'>
          이상형 월드컵을 찾지 못했습니다.
        </p>
        <div className='mb-4 text-lg font-light text-gray-500 dark:text-gray-400'>
          직접 만들어 보세요!
        </div>
        <div className='flex flex-col w-48'>
          <LinkButton
            href='/wc/create'
            variant='primary'
            size='medium'
            className='mb-2'
          >
            이상형 월드컵 만들기{' '}
          </LinkButton>
          <Button onClick={() => router.back()} variant='outline' size='medium'>
            돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
}
