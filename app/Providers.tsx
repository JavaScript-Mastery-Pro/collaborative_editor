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
        const users = await getClerkUsers({ userIds });
        return users;
      }}
      resolveMentionSuggestions={async ({ text }) => {
        console.log({ text });
        const users = await getClerkUsers({ text });

        console.log({ users });

        // if (text) {
        //   users = users.filter((user: User) => user.email.includes(text));
        //   return users.map((user: User) => user.email);
        // }

        return users.map((user: User) => user.email);
      }}
      // resolveRoomsInfo={async ({ roomIds }) => {

      // }}
    >
      <ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
    </LiveblocksProvider>
  );
}
