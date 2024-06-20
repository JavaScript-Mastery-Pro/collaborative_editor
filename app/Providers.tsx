"use client";

import { useUser } from "@clerk/nextjs";
import { LiveblocksProvider } from "@liveblocks/react/suspense";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();

  console.log({ user });

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <LiveblocksProvider
      publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY as string}
    >
      {children}
    </LiveblocksProvider>
  );
}
