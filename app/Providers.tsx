'use client';

import { LiveblocksProvider } from '@liveblocks/react/suspense';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  // const router = useRouter();
  // const { isLoaded, isSignedIn, user } = useUser();

  // console.log({ user });

  // if (!isLoaded || !isSignedIn) {
  //   router.push("/sign-in");
  // }

  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      {children}
    </LiveblocksProvider>
  );
}
