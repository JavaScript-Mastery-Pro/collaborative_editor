'use client';

import { LiveblocksProvider } from '@liveblocks/react/suspense';
import { ReactNode } from 'react';

import { getClerkUsers } from '@/lib/actions/user.actions';

export function Providers({ children }: { children: ReactNode }) {
  // const router = useRouter();
  // const { isLoaded, isSignedIn, user } = useUser();

  // console.log({ user });

  // if (!isLoaded || !isSignedIn) {
  //   router.push("/sign-in");
  // }

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={async ({ userIds }) => {
        const users = await getClerkUsers(userIds);

        return users;
      }}
      resolveMentionSuggestions={async ({ text }) => {
        let users = await getClerkUsers();

        if (text) {
          users = users.filter((user: User) => user.name.includes(text));
        }

        return users.map((user: User) => user.email);
      }}
    >
      {children}
    </LiveblocksProvider>
  );
}
