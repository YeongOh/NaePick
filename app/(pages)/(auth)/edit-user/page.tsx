import { getSession } from '@/app/lib/actions/session';
import UpdateUserForm from '@/app/components/auth/update-user-form';

export default async function Page() {
  const session = await getSession();

  return (
    <div className='max-w-xl m-auto'>
      <UpdateUserForm stringifiedSession={JSON.stringify(session)} />
    </div>
  );
}
