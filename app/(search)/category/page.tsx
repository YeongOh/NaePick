import { notFound } from 'next/navigation';

import MyImage from '@/app/components/ui/MyImage';
import { getCategoriesForSearch } from '@/app/lib/category/service';
import { translateCategory } from '@/app/lib/types';

import CategoryLink from './components/CategoryLink';

export default async function Page() {
  const categories = await getCategoriesForSearch();

  if (!categories) {
    notFound();
  }

  return (
    <section className="m-auto max-w-screen-2xl">
      <h1 className="mt-6 text-xl font-semibold text-primary-500">카테고리</h1>
      <ul className="grid grid-cols-category-12rem justify-center gap-4">
        {categories.map(({ id, name, categoryCount }) => (
          <CategoryLink key={name} id={id} name={name}>
            <div className="h-64 w-full overflow-hidden rounded-xl">
              <MyImage
                className="size-full object-cover"
                src={`category/${name}.webp`}
                alt={translateCategory(name)}
              />
            </div>
            <div className="p-1 text-base">
              <h2 className="font-semibold text-slate-700">{translateCategory(name)}</h2>
              {categoryCount > 0 ? (
                <div className="text-sm text-gray-500">월드컵 {categoryCount}개</div>
              ) : null}
            </div>
          </CategoryLink>
        ))}
      </ul>
    </section>
  );
}
