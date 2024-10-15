import { getSession } from '@/app/lib/actions/session';
import UpdateUserForm from '@/app/ui/auth/UpdateUserForm';

export default async function Page() {
  const session = await getSession();
  console.log(session);

  return <UpdateUserForm stringifiedSession={JSON.stringify(session)} />;
}
