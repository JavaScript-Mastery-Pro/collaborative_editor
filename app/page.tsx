import { CollaborativeApp } from "@/components/CollaborativeApp";

import { Room } from "../components/Room";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Room>
        <CollaborativeApp />
      </Room>
    </main>
  );
}
