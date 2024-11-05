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
      <MainNav />
      <ul className='grid grid-cols-category-13rem justify-center gap-4 mt-4'>
        {categories.map(({ categoryId, name }) => (
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
            <h2 className='text-lg font-semibold text-slate p-1'>
              {translateCategory(name)}
            </h2>
          </Link>
        ))}
      </ul>
    </section>
  );
}
