'use client';
import { RoomProvider, ClientSideSuspense } from '@liveblocks/react/suspense';
import Image from 'next/image';
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
        fallback={
          <div className="flex size-full h-screen items-center justify-center gap-3 text-[#666666]">
            <Image
              src="/assets/icons/loader.svg"
              alt="loader"
              width={32}
              height={32}
              className="animate-spin"
            />
            Loading...
          </div>
        }
      >
        {children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
