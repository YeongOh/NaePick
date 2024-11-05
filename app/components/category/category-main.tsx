import { Category, translateCategory } from '@/app/lib/definitions';
import MainNav from '../main/main-nav';
import MyImage from '../ui/my-image';
import Link from 'next/link';

interface Props {
  categories: Category[];
}

export default function CategoryMain({ categories }: Props) {
  return (
    <section className='max-w-screen-2xl m-auto'>
      <h1 className='font-semibold text-primary-500 text-xl mt-6'>카테고리</h1>
      <ul className='grid grid-cols-category-12rem justify-center gap-4'>
        {categories.map(({ categoryId, name, categoryCount }) => (
          <Link
            href={`/category/${name}`}
            key={`category-${categoryId}`}
            className='mt-6'
          >
            <div className='w-full h-64 rounded-xl overflow-hidden'>
              <MyImage
                className='object-cover size-full'
                src={`category/${name}.webp`}
                alt={translateCategory(name)}
              />
            </div>
            <div className='p-1 text-base'>
              <h2 className='font-semibold text-slate-700'>
                {translateCategory(name)}
              </h2>
              {categoryCount > 0 ? (
                <div className='text-gray-500 text-sm'>
                  월드컵 {categoryCount}개
                </div>
              ) : null}
            </div>
          </Link>
        ))}
      </ul>
    </section>
  );
}
