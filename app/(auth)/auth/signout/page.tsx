import SignoutForm from './components/SignoutForm';

export default async function Page() {
  return (
    <section className='max-w-xs m-auto min-h-screen flex flex-col justify-center items-center'>
      <SignoutForm />
    </section>
  );
}
