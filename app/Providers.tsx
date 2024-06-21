"use client";

import { useUser } from "@clerk/nextjs";
import { LiveblocksProvider } from "@liveblocks/react/suspense";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();

  console.log({ user });

  if (!isLoaded || !isSignedIn) {
    router.push("/sign-in");
  }

  return (
    <LiveblocksProvider
      // publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY as string}
      authEndpoint="/api/liveblocks-auth"
    >
      {children}
    </LiveblocksProvider>
  );
}
