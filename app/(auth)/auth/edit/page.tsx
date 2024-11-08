import { getSession } from '@/app/lib/session';
import { redirect } from 'next/navigation';
import EditUserForm from './components/EditUserForm';

export default async function Page() {
  const session = await getSession();

  if (!session.userId) {
    redirect('/auth/login');
  }

  return (
    <section className="max-w-xs m-auto min-h-screen flex flex-col justify-center items-center">
      <EditUserForm userId={session.userId} nickname={session.nickname} profilePath={session.profilePath} />
    </section>
  );
}
