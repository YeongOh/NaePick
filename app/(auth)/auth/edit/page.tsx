import { redirect } from 'next/navigation';

import { getSession } from '@/app/lib/session';

import EditUserForm from './components/EditUserForm';

export default async function Page() {
  const session = await getSession();

  if (!session || !session.userId) {
    redirect('/auth/login');
  }

  return (
    <section className="relative m-auto min-h-screen max-w-xs">
      <EditUserForm
        userId={session.userId}
        nickname={session.nickname}
        profilePath={session.profilePath}
        email={session.email}
      />
    </section>
  );
}
