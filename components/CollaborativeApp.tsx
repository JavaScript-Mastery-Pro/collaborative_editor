"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
import { useOthers, useSelf } from "@liveblocks/react/suspense";
import Image from "next/image";

import { Editor } from "@/components/Editor/Editor";

export function CollaborativeApp() {
  const self = useSelf((me) => me.info);
  const others = useOthers();

  const users = [self, ...others.map((other) => other.info)];

  console.log("Self", self);
  console.log("Others", others);
  console.log("Users", users);

  const userCount = others.length;
  return (
    <div className="flex size-full flex-1 flex-col items-center border-4">
      <div className="h-10 w-full p-5">
        <div className="flex justify-end -space-x-1 overflow-hidden">
          {users.map((user) => {
            return (
              <Image
                key={user.clerkId}
                src={user.avatar}
                alt={user.name}
                width={100}
                height={100}
                className="inline-block size-8 rounded-full ring-2 ring-[#eee]"
              />
            );
          })}
        </div>
      </div>
      <div className="flex w-fit flex-col p-10">
        <div className="w-[382px] gap-4 rounded-lg bg-white p-3">
          <p className="mb-1 border-b text-[18px]">User Info</p>
          <div className="flex gap-2">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <p>{self.name}</p>
          </div>
          <p>{self.clerkId}</p>
          <div className="flex flex-col gap-2">
            <p>{self.email}</p>
          </div>
        </div>

        <Editor />

        <p>There are {userCount + 1} user(s) online.</p>
      </div>
    </div>
  );
}
