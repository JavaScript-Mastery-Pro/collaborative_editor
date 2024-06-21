"use client";

import { useMyPresence, useOthers, useSelf } from "@liveblocks/react/suspense";

import { Editor } from "@/components/Editor/Editor";

export function CollaborativeApp() {
  const self = useSelf((me) => me.info);
  const others = useOthers();
  const [myPresence, updateMyPresence] = useMyPresence();

  console.log("Self", self);
  console.log("Others", others);
  console.log("myPresence", myPresence);

  const userCount = others.length;
  return (
    <>
      <Editor />
      <p>There are {userCount} other user(s) online</p>
    </>
  );
}
