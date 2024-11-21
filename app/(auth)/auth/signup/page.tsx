import SignupForm from './components/SignupForm';

export const metadata = {
  title: '회원가입',
};

export default async function Page() {
  return (
    <section className="relative m-auto min-h-screen max-w-xs">
      <SignupForm />
    </section>
  );
}
