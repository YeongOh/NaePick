import { notFound } from 'next/navigation';
import { getCategoriesForSearch } from '@/app/lib/category/service';
import MyImage from '@/app/ui/MyImage';
import { translateCategory } from '@/app/utils';
import CategoryLink from './components/CategoryLink';
import Grid from '@/app/ui/Grid';

export default async function Page() {
  const categories = await getCategoriesForSearch();

  if (!categories) {
    notFound();
  }

  return (
    <section className="m-auto max-w-screen-2xl">
      <h1 className="mt-6 text-xl font-semibold text-primary-500">카테고리</h1>
      <Grid>
        {categories.map(({ id, name, categoryCount }) => (
          <CategoryLink key={name} id={id} name={name}>
            <div className="h-48 w-full overflow-hidden rounded-xl">
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
      </Grid>
    </section>
  );
}
