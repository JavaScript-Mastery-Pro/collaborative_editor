'use client';

import { useUser } from '@clerk/clerk-react';
import {
  ClientSideSuspense,
  LiveblocksProvider,
} from '@liveblocks/react/suspense';
import { ReactNode } from 'react';

import { getClerkUsers, getDocumentUsers } from '@/lib/actions/user.actions';

import { Loader } from '@/components/Loader';

export function Provider({ children }: { children: ReactNode }) {
  const { user: clerkUser } = useUser();

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={async ({ userIds }) => {
        const users = await getClerkUsers({ userIds });
        return users;
      }}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        const roomUsers = await getDocumentUsers({
          roomId,
          currentUser: clerkUser?.emailAddresses[0].emailAddress!,
          text,
        });
        return roomUsers;
      }}
    >
      <ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
    </LiveblocksProvider>
  );
}
