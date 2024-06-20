"use client";

import { useOthers } from "@liveblocks/react/suspense";

import { Editor } from "@/components/Editor/Editor";

export function CollaborativeApp() {
  const others = useOthers();
  const userCount = others.length;
  return (
    <div>
      <Editor />

      <p>There are {userCount} other user(s) online</p>
    </div>
  );
}
