import { getSession } from '@/app/lib/actions/session';
import UpdateUserForm from '@/app/components/auth/update-user-form';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await getSession();

  if (!session.userId) {
    redirect('/signin/');
  }

  return (
    <section className='max-w-xs m-auto min-h-screen flex flex-col justify-center items-center'>
      <UpdateUserForm />
    </section>
  );
}
