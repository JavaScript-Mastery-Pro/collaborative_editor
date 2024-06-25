'use client';

import { SignedIn, UserButton } from '@clerk/nextjs';
import { useOthers, useSelf } from '@liveblocks/react/suspense';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { deleteDocument, updateDocument } from '@/lib/actions/room.actions';

import { Editor } from '@/components/Editor/Editor';

import { Comments } from './Comments';
import { ShareDocument } from './ShareDocument';
import { Button } from './ui/button';
import { Input } from './ui/input';

type CollaborativeAppProps = {
  roomId: string;
  roomMetadata: RoomMetadata;
};

export function CollaborativeApp({
  roomId,
  roomMetadata,
}: CollaborativeAppProps) {
  const router = useRouter();
  const self = useSelf((me) => me.info);
  const others = useOthers();

  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);
  const users = [self, ...others.map((other) => other.info)];

  const deleteDocumentHandler = async () => {
    try {
      await deleteDocument(roomId);
    } catch (error) {
      console.log('Error notif:', error);
    }
  };

  const updateTitleHandler = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter') {
      try {
        if (documentTitle !== roomMetadata.title) {
          await updateDocument(roomId, documentTitle);
        }
      } catch (error) {
        console.log('Error notif:', error);
      }
    }
  };

  return (
    <div className="flex size-full flex-1 flex-col items-center border-4">
      <div className="flex w-full items-center justify-between border p-5">
        <div className="flex w-80 gap-2">
          <Button variant="secondary" onClick={() => router.push('/documents')}>
            Back
          </Button>
          <Button variant="destructive" onClick={deleteDocumentHandler}>
            Delete
          </Button>

          <ShareDocument roomId={roomId} />
        </div>
        <Input
          type="email"
          value={documentTitle}
          placeholder="Enter title"
          onChange={(e) => setDocumentTitle(e.target.value)}
          onKeyDown={(e) => updateTitleHandler(e)}
          className="border-none bg-transparent text-center text-xl font-bold focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <div className="flex w-80 justify-end -space-x-1 overflow-hidden">
          {users.map((user) => {
            return (
              <Image
                key={user.id}
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
      <div className="flex gap-10 p-10">
        <div className="flex w-fit flex-col ">
          <div className="w-[382px] gap-4 rounded-lg bg-white p-3">
            <p className="border-b text-[18px]">User Info</p>
            <p className="mb-2 border-b py-1">Room Id: {roomId}</p>
            <div className="flex gap-2">
              <SignedIn>
                <UserButton />
              </SignedIn>
              <p>{self.name}</p>
            </div>
            <p>{self.id}</p>
            <div className="flex flex-col gap-2">
              <p>{self.email}</p>
            </div>
          </div>

          <Editor />
          <p>There are {others.length + 1} user(s) online.</p>
        </div>

        <div className="flex-1">
          <Comments />
        </div>
      </div>
    </div>
  );
}
