import SigninForm from './components/SigninForm';

export const metadata = {
  title: '로그인',
};

export default async function Page() {
  return (
    <section className="relative m-auto min-h-screen max-w-xs">
      <SigninForm />
    </section>
  );
}
