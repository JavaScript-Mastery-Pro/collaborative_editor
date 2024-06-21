import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { CollaborativeApp } from "@/components/CollaborativeApp";

import { Room } from "../components/Room";

export default async function Home() {
  const user = await currentUser();

  if (!user) return redirect("/sign-in");

  console.log({ user });

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Room>
        <div className="w-[382px] rounded-lg bg-white p-3">
          <p className="mb-1 border-b text-[18px]">User Info</p>
          <p>
            {user.firstName}
            {user.lastName}{" "}
          </p>
          <div className="flex flex-col gap-2">
            <p>{user.id}</p>
            <p>{user.emailAddresses[0].emailAddress}</p>
            <p>{user.emailAddresses[0].linkedTo[0].type}</p>
          </div>
        </div>

        <CollaborativeApp />
      </Room>
    </main>
  );
}
