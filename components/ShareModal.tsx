'use client';

import Image from 'next/image';
import { useState } from 'react';

import { shareDocumentAccess } from '@/lib/actions/room.actions';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type ShareDocumentDialogProps = {
  roomId: string;
  usersAccesses: RoomAccesses;
};

export const ShareModal = ({
  roomId,
  usersAccesses,
}: ShareDocumentDialogProps) => {
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // const users = Object.entries(usersAccesses).map(([email, access]) => ({
  //   email,
  //   access,
  // }));

  const shareDocumentHandler = async () => {
    setLoading(true);

    try {
      const room = await shareDocumentAccess({
        roomId,
        email,
        userType: 'editor',
      });

      if (room) setOpen(false);
    } catch (error) {
      console.log('Error notif:', error);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex h-9 gap-1 bg-[#2196f3] px-2 hover:bg-[#3987cf]">
          <Image
            src="/assets/icons/share.svg"
            alt="share"
            width={20}
            height={20}
            className="size-4 md:size-5"
          />
          <p className="mr-1 hidden sm:block">Share</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Invite collaborators</DialogTitle>
        </DialogHeader>

        <Input
          id="email"
          placeholder="Enter email address"
          value={email}
          className="focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* 
        <ul className="flex flex-col">
          {users.map((user, i) => (
            <li key={user.email + i} className="border-b px-2 py-4 ">
              <p className="text-sm text-[#444]">{user.email}</p>
            </li>
          ))}
        </ul> */}

        <DialogFooter className="mt-2 flex gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={shareDocumentHandler}
            className="bg-[#2196f3] hover:bg-[#3987cf]"
          >
            {loading ? 'Sending Invite...' : 'Invite'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
