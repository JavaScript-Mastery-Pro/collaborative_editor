'use client';

import Image from 'next/image';
import { useState } from 'react';

import {
  removeCollaborator,
  shareDocumentAccess,
} from '@/lib/actions/room.actions';

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
  collaborators: User[];
  creatorId: string;
};

export const ShareModal = ({
  roomId,
  collaborators,
  creatorId,
}: ShareDocumentDialogProps) => {
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const shareDocumentHandler = async () => {
    setLoading(true);

    try {
      const room = await shareDocumentAccess({
        roomId,
        email,
        userType: 'editor',
      });

      if (room) setEmail('');
    } catch (error) {
      console.log('Error notif:', error);
    }

    setLoading(false);
  };

  const removeCollaboratorHandler = async (email: string) => {
    setLoading(true);

    try {
      await removeCollaborator({ roomId, email });
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
      <DialogContent className="w-full max-w-[400px] rounded-xl">
        <DialogHeader>
          <DialogTitle>Invite collaborators</DialogTitle>
        </DialogHeader>

        <Input
          id="email"
          placeholder="Enter email address"
          value={email}
          className="mt-4 h-11 border bg-[#f8f8f8] focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="my-2 space-y-2">
          <p className="text-[#444]">Collaborators:</p>
          <ul className="flex flex-col">
            {collaborators.map((collaborator, i) => (
              <li
                key={collaborator.id}
                className="flex items-center justify-between gap-2 border-b px-2 py-3 last:border-b"
              >
                <div className="flex gap-2">
                  <Image
                    src={collaborator.avatar}
                    alt="avatar"
                    width={36}
                    height={36}
                    className="rounded-full border-2 border-[#2196f3] "
                  />
                  <div>
                    <p className="line-clamp-1 text-sm font-semibold leading-4 text-[#444]">
                      {collaborator.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {collaborator.email}
                    </p>
                  </div>
                </div>

                {creatorId === collaborator.id ? (
                  <p className="text-sm text-gray-400">admin</p>
                ) : (
                  <Button
                    type="button"
                    onClick={() =>
                      removeCollaboratorHandler(collaborator.email)
                    }
                    className="rounded-lg bg-transparent p-2 hover:bg-transparent"
                  >
                    <Image
                      src="/assets/icons/close.svg"
                      alt="close"
                      width={20}
                      height={20}
                    />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </div>

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
            className="flex gap-1 bg-[#2196f3] hover:bg-[#3987cf]"
          >
            <Image
              src="/assets/icons/add.svg"
              alt="add"
              width={20}
              height={20}
            />
            {loading ? 'Sending Invite...' : 'Invite'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
