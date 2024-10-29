import { getSession } from '@/app/lib/actions/session';
import UpdateUserForm from '@/app/components/auth/update-user-form';

export default async function Page() {
  const session = await getSession();

  return (
    <section className='max-w-xs m-auto min-h-screen flex flex-col justify-center items-center'>
      <UpdateUserForm stringifiedSession={JSON.stringify(session)} />
    </section>
  );
}
