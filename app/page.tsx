import { currentUser } from "@clerk/nextjs/server";

import { CollaborativeApp } from "./CollaborativeApp";
import { Room } from "./Room";

export default async function Home() {
  const user = await currentUser();

  if (!user) return <div>Not signed in</div>;

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Room>
        <p>Hello {user?.firstName} </p>
        <div className="flex flex-col gap-2">
          <p>ID: {user.id}</p>
          <p>Email: {user.emailAddresses[0].emailAddress}</p>
          <p>OAuth: {user.emailAddresses[0].linkedTo[0].type}</p>
        </div>

        <CollaborativeApp />
      </Room>
    </main>
  );
}
