import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center gap-10">
      <h2 className="text-2xl font-bold">Sign-in</h2>
      <SignIn />
    </main>
  );
}
