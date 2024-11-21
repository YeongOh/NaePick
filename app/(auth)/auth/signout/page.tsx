import SignoutForm from './components/SignoutForm';

export const metadata = {
  title: '로그아웃',
};

export default async function Page() {
  return (
    <section className="m-auto flex min-h-screen max-w-xs flex-col items-center justify-center">
      <SignoutForm />
    </section>
  );
}
