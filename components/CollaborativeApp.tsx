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
  users: User[];
  userType: UserType;
};

export function CollaborativeApp({
  roomId,
  roomMetadata,
  users,
  userType,
}: CollaborativeAppProps) {
  const others = useOthers();

  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const otherUsers = others.map((other) => other.info);

  console.log({ otherUsers });

  const updateTitleHandler = async (
    e: React.KeyboardEvent<HTMLInputElement>,
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
      <div className="flex h-full min-h-[92px] w-screen min-w-full flex-nowrap items-center justify-between gap-2 overflow-auto px-4">
        {/* Logo */}
        <Link href="/" className="md:flex-1">
          <Image
            src="/assets/icons/logo.svg"
            alt="file"
            width={120}
            height={32}
            className="hidden sm:block"
          />
          <Image
            src="/assets/icons/logo-icon.svg"
            alt="file"
            width={32}
            height={32}
            className="mr-2 sm:hidden"
          />
        </Link>

        {/* Title */}
        <div
          ref={containerRef}
          className="flex w-fit items-center justify-center gap-2"
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
              className="xs:max-w-full min-w-[78px] border-none bg-transparent px-0 text-left text-base font-semibold leading-[24px] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:text-black sm:text-xl md:text-center"
            />
          ) : (
            <>
              <p className="line-clamp-1 border-l border-dark-400 pl-3 text-base font-semibold leading-[24px] sm:border-none sm:pl-0 sm:text-xl">
                {documentTitle}
              </p>
              {userType === 'editor' && !loading ? (
                <Image
                  src="/assets/icons/edit.svg"
                  alt="edit"
                  width={20}
                  height={20}
                  onClick={() => setEditing(true)}
                  className="cursor-pointer"
                />
              ) : (
                <p className="rounded-md bg-dark-400/50 px-2 py-0.5 text-[12px] text-blue-100/50">
                  View only
                </p>
              )}
            </>
          )}
          {loading && <p className="text-sm text-gray-400">saving...</p>}
        </div>

        {/* Collaborators & Actions */}
        <div className="flex w-full flex-1 justify-end gap-2">
          {otherUsers.length > 0 && (
            <ul className="hidden items-center justify-end -space-x-3 overflow-hidden sm:flex">
              {otherUsers.map((user) => {
                return (
                  <li key={user.id}>
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={100}
                      height={100}
                      className="inline-block size-8 rounded-full ring-2 ring-dark-100"
                      style={{ border: `3px solid ${user.color}` }}
                    />
                  </li>
                );
              })}
            </ul>
          )}

          <ShareModal
            roomId={roomId}
            collaborators={users}
            creatorId={roomMetadata.creatorId}
            currentUserType={userType}
          />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>

      <Editor roomId={roomId} userType={userType} />

      <div className="fixed bottom-0 left-0 w-full border-t border-dark-300 bg-dark-100 px-4 py-2">
        <p className="text-sm font-normal text-blue-100/50">
          There are {others.length + 1} user(s) online.
        </p>
      </div>
    </div>
  );
}
