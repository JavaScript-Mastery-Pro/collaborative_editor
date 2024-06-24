import { SignedIn, UserButton } from '@clerk/nextjs';

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      Home page
      <SignedIn>
        <UserButton />
      </SignedIn>
    </main>
  );
}
