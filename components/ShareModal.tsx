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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    try {
      await removeCollaborator({ roomId, email });
    } catch (error) {
      console.log('Error notif:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-blue flex h-9 gap-1 px-4 hover:bg-[#3987cf]">
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
      <DialogContent className="shad-dialog w-full max-w-[400px] rounded-xl border-none bg-doc bg-cover px-5 py-7 shadow-xl md:min-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage who can view this project</DialogTitle>
          <DialogDescription>
            Select which users can access and view this project.
          </DialogDescription>
        </DialogHeader>

        <Label htmlFor="email" className="mt-6 text-blue-100">
          Email address
        </Label>
        <div className=" flex items-center gap-3">
          <Input
            id="email"
            placeholder="Enter email address"
            value={email}
            className="h-11 border-none bg-dark-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            onClick={shareDocumentHandler}
            className="gradient-blue flex gap-1 px-5 hover:bg-[#3987cf]"
          >
            {loading ? 'Sending Invite...' : 'Invite'}
          </Button>
        </div>

        <div className="my-2 space-y-2">
          <ul className="flex flex-col">
            {collaborators.map((collaborator, i) => (
              <li
                key={collaborator.id}
                className="flex items-center justify-between gap-2 py-3"
              >
                <div className="flex gap-2">
                  <Image
                    src={collaborator.avatar}
                    alt="avatar"
                    width={36}
                    height={36}
                    className="size-9 rounded-full border-[#2196f3] "
                  />
                  <div>
                    <p className="line-clamp-1 text-sm font-semibold leading-4 text-white">
                      {collaborator.name}
                    </p>
                    <p className="text-sm font-light text-blue-100">
                      {collaborator.email}
                    </p>
                  </div>
                </div>

                {creatorId === collaborator.id ? (
                  <p className="text-sm text-blue-100">Owner</p>
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
      </DialogContent>
    </Dialog>
  );
};
