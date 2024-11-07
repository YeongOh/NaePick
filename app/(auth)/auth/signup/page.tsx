import SignupForm from '@/app/(auth)/auth/signup/components/SignupForm';

export default async function Page() {
  return (
    <section className='max-w-xs m-auto min-h-screen flex flex-col justify-center items-center'>
      <SignupForm />
    </section>
  );
}
