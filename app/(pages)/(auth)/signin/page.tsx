import SigninForm from '@/app/components/auth/signin-form';

export default async function Page() {
  return (
    <section className='max-w-xs m-auto min-h-screen flex flex-col justify-center items-center'>
      <SigninForm />
    </section>
  );
}
