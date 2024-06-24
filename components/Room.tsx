'use client';

import { RoomProvider, ClientSideSuspense } from '@liveblocks/react/suspense';
import { ReactNode } from 'react';

export function Room({
  roomId,
  children,
}: {
  roomId: string;
  children: ReactNode;
}) {
  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense
        fallback={<div className="flex h-screen items-center">Loading…</div>}
      >
        {children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
