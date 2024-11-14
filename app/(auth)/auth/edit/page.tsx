import { getSession } from '@/app/lib/session';
import { redirect } from 'next/navigation';
import EditUserForm from './components/EditUserForm';

export default async function Page() {
  const session = await getSession();

  if (!session || !session.userId) {
    redirect('/auth/login');
  }

  return (
    <section className="m-auto flex min-h-screen max-w-xs flex-col items-center justify-center">
      <EditUserForm
        userId={session.userId}
        nickname={session.nickname}
        profilePath={session.profilePath}
        email={session.email}
      />
    </section>
  );
}
