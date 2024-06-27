'use client';

import { SignedIn, UserButton } from '@clerk/nextjs';
import { useOthers } from '@liveblocks/react/suspense';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { updateDocument } from '@/lib/actions/room.actions';

import { Editor } from '@/components/Editor/Editor';

import { ShareModal } from './ShareModal';
import { Input } from './ui/input';

type CollaborativeAppProps = {
  roomId: string;
  roomMetadata: RoomMetadata;
  usersAccesses: RoomAccesses;
};

export function CollaborativeApp({
  roomId,
  roomMetadata,
  usersAccesses,
}: CollaborativeAppProps) {
  const others = useOthers();

  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const users = others.map((other) => other.info);

  const updateTitleHandler = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter') {
      setLoading(true);

      try {
        if (documentTitle !== roomMetadata.title) {
          const updatedDocument = await updateDocument(roomId, documentTitle);

          if (updatedDocument) {
            setEditing(false);
          }
        }
      } catch (error) {
        console.log('Error notif:', error);
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setEditing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  return (
    <div className="flex size-full max-h-screen flex-1 flex-col items-center overflow-hidden">
      {/* Header */}
      {/* <div className="flex w-full justify-center border"> */}
      <div className="flex h-full min-h-[64px] w-screen min-w-full flex-nowrap items-center justify-between gap-2 overflow-auto border-b px-4">
        {/* Logo */}
        <div className="flex gap-2 md:flex-1">
          <Link href="/" className=" flex items-center gap-1 ">
            <Image
              src="/assets/icons/doc.svg"
              alt="file"
              width={32}
              height={32}
            />
            <p className="hidden pt-1 text-[20px] font-semibold text-[#2196f3] md:block">
              Docs
            </p>
          </Link>
        </div>

        {/* Title */}
        <div
          ref={containerRef}
          className="flex w-1/2 items-center justify-center gap-2 sm:w-fit"
        >
          {editing && !loading ? (
            <Input
              type="email"
              value={documentTitle}
              ref={inputRef}
              placeholder="Enter title"
              onChange={(e) => setDocumentTitle(e.target.value)}
              onKeyDown={(e) => updateTitleHandler(e)}
              disabled={!editing}
              className="min-w-[78px] border-none bg-transparent text-center text-xl font-semibold text-[#444] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:text-black"
            />
          ) : (
            <>
              <p className="line-clamp-1 font-semibold leading-[24px] text-[#444] sm:text-xl">
                {documentTitle}
              </p>
              <Image
                src="/assets/icons/edit.svg"
                alt="file"
                width={18}
                height={18}
                onClick={() => setEditing(true)}
                className="cursor-pointer"
              />
            </>
          )}
          {loading && <p className="text-sm text-gray-400">saving...</p>}
        </div>

        {/* Collaborators & Actions */}
        <div className="flex w-full flex-1 justify-end gap-2">
          {users.length > 0 && (
            <ul className="hidden items-center justify-end -space-x-3 overflow-hidden sm:flex">
              {users.map((user) => {
                return (
                  <li key={user.id}>
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={100}
                      height={100}
                      className="inline-block size-8 rounded-full border-2 border-[#2196f3] ring-2 ring-white"
                    />
                  </li>
                );
              })}
            </ul>
          )}

          <ShareModal roomId={roomId} usersAccesses={usersAccesses} />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
      {/* </div> */}

      <Editor roomId={roomId} />

      <div className="fixed bottom-0 left-0 w-full border-t border-gray-300/40 bg-white px-4 py-2">
        <p className="text-sm text-[#444]">
          There are {others.length + 1} user(s) online.
        </p>
      </div>
    </div>
  );
}
