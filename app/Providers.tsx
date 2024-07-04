'use client';

import {
  ClientSideSuspense,
  LiveblocksProvider,
} from '@liveblocks/react/suspense';
import { ReactNode } from 'react';

import { getClerkUsers } from '@/lib/actions/user.actions';

import { Loader } from '@/components/Loader';

export function Providers({ children }: { children: ReactNode }) {
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
          return users.map((user: User) => user.email);
        }
      }}
    >
      <ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
    </LiveblocksProvider>
  );
}
