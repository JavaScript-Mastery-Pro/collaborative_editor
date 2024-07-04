'use client';

import { RoomProvider, ClientSideSuspense } from '@liveblocks/react/suspense';
import { ReactNode } from 'react';

import { Loader } from '@/components/Loader';

export function Room({
  roomId,
  children,
}: {
  roomId: string;
  children: ReactNode;
}) {
  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
    </RoomProvider>
  );
}
