import SignupForm from './components/SignupForm';

export default async function Page() {
  return (
    <section className="m-auto flex min-h-screen max-w-xs flex-col items-center justify-center">
      <SignupForm />
    </section>
  );
}
