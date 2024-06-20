"use client";

import { RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import { ReactNode } from "react";

export function Room({ children }: { children: ReactNode }) {
  return (
    <RoomProvider id="my-room">
      <ClientSideSuspense fallback={<div>Loading…</div>}>
        {children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
