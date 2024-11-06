import { getSession } from '@/app/lib/actions/session';
import UpdateUserForm from '@/app/components/auth/update-user-form';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await getSession();
  console.log(session);

  if (!session.userId) {
    redirect('/signin/');
  }

  return (
    <section className='max-w-xs m-auto min-h-screen flex flex-col justify-center items-center'>
      <UpdateUserForm
        userId={session.userId}
        nickname={session.nickname}
        profilePathname={session.profilePathname}
      />
    </section>
  );
}
