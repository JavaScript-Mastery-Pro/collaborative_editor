import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="auth-page">
      <SignIn />
    </main>
  );
}
