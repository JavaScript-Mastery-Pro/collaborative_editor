'use client';

import { useSelf } from '@liveblocks/react/suspense';
import Image from 'next/image';
import { useState } from 'react';

import {
  removeCollaborator,
  updateDocumentAccess,
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
import { UserTypeSelector } from '@/components/UserTypeSelector';

type ShareDocumentDialogProps = {
  roomId: string;
  collaborators: User[];
  creatorId: string;
  currentUserType: UserType;
};

export const ShareModal = ({
  roomId,
  collaborators,
  creatorId,
  currentUserType,
}: ShareDocumentDialogProps) => {
  const user = useSelf();

  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<UserType>('viewer');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const shareDocumentHandler = async () => {
    setLoading(true);

    try {
      const room = await updateDocumentAccess({
        roomId,
        email,
        userType: userType as UserType,
        updatedBy: user.info,
      });

      if (room) setEmail('');
    } catch (error) {
      console.log('Error notif:', error);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="gradient-blue flex h-9 gap-1 px-4 "
          disabled={currentUserType !== 'editor'}
        >
          <Image
            src="/assets/icons/share.svg"
            alt="share"
            width={20}
            height={20}
            className="min-w-4 md:size-5"
          />
          <p className="mr-1 hidden sm:block">Share</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog">
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
          <div className="flex flex-1 rounded-md bg-dark-400">
            <Input
              id="email"
              placeholder="Enter email address"
              value={email}
              className="share-input"
              onChange={(e) => setEmail(e.target.value)}
            />
            <UserTypeSelector userType={userType} setUserType={setUserType} />
          </div>
          <Button
            type="submit"
            onClick={shareDocumentHandler}
            className="gradient-blue flex h-full gap-1 px-5"
          >
            {loading ? 'Sending...' : 'Invite'}
          </Button>
        </div>

        <div className="my-2 space-y-2">
          <ul className="flex flex-col">
            {collaborators.map((collaborator, i) => (
              <Collaborator
                key={collaborator.id + 1}
                roomId={roomId}
                creatorId={creatorId}
                email={collaborator.email}
                collaborator={collaborator}
                user={user.info}
              />
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Collaborator = ({
  roomId,
  creatorId,
  collaborator,
  email,
  user,
}: {
  roomId: string;
  email: string;
  creatorId: string;
  collaborator: User;
  user: User;
}) => {
  const [userType, setUserType] = useState(collaborator.userType || 'viewer');
  const [loading, setLoading] = useState(false);

  const shareDocumentHandler = async (type: string) => {
    setLoading(true);

    try {
      await updateDocumentAccess({
        roomId,
        email,
        userType: type as UserType,
        updatedBy: user,
      });
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
    <li className="flex items-center justify-between gap-2 py-3">
      <div className="flex gap-2">
        <Image
          src={collaborator.avatar}
          alt="avatar"
          width={36}
          height={36}
          className="size-9 rounded-full"
        />
        <div>
          <p className="line-clamp-1 text-sm font-semibold leading-4 text-white">
            {collaborator.name}
            <span className="text-10-regular pl-2 text-blue-100">
              {loading && 'updating...'}
            </span>
          </p>
          <p className="text-sm font-light text-blue-100">
            {collaborator.email}
          </p>
        </div>
      </div>

      {creatorId === collaborator.id ? (
        <p className="text-sm text-blue-100">Owner</p>
      ) : (
        <div className="flex items-center">
          <UserTypeSelector
            userType={userType as UserType}
            setUserType={setUserType || 'viewer'}
            onClickHandler={shareDocumentHandler}
          />
          <Button
            type="button"
            onClick={() => removeCollaboratorHandler(collaborator.email)}
            className="remove-btn"
          >
            Remove
          </Button>
        </div>
      )}
    </li>
  );
};
