'use client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ShareDocumentDialogProps = {
  roomId: string;
  collaborators: User[];
  creatorId: string;
  currentUserType: UserType;
  user: User;
};

export const ShareModal = ({
  roomId,
  collaborators,
  creatorId,
  currentUserType,
  user,
}: ShareDocumentDialogProps) => {
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
        updatedBy: user,
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
          className="gradient-blue flex h-9 gap-1 px-4 hover:bg-[#3987cf]"
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
      <DialogContent className="shad-dialog w-full max-w-[400px] rounded-xl border-none bg-doc bg-cover px-5 py-7 shadow-xl sm:min-w-[500px]">
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
              className="h-11 flex-1 border-none bg-dark-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) => setEmail(e.target.value)}
            />
            <UserTypeSelector userType={userType} setUserType={setUserType} />
          </div>
          <Button
            type="submit"
            onClick={shareDocumentHandler}
            className="gradient-blue flex gap-1 px-5 hover:bg-[#3987cf]"
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
                user={user}
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
          className="size-9 rounded-full border-[#2196f3] "
        />
        <div>
          <p className="line-clamp-1 text-sm font-semibold leading-4 text-white">
            {collaborator.name}
            <span className="pl-2 text-[10px] text-blue-100">
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
            className="rounded-lg bg-transparent px-0 text-red-500 hover:bg-transparent"
          >
            Remove
          </Button>
        </div>
      )}
    </li>
  );
};

const UserTypeSelector = ({
  userType,
  setUserType,
  onClickHandler,
}: {
  userType: string;
  setUserType: React.Dispatch<React.SetStateAction<UserType>>;
  onClickHandler?: (value: string) => void;
}) => {
  const accessChangeHandler = (type: UserType) => {
    setUserType(type);
    onClickHandler && onClickHandler(type);
  };

  return (
    <Select
      value={userType}
      onValueChange={(type: UserType) => accessChangeHandler(type)}
    >
      <SelectTrigger className="w-fit border-none bg-transparent text-blue-100">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="border-none bg-dark-200 ">
        <SelectItem
          value="viewer"
          className="cursor-pointer bg-dark-200 text-blue-100 focus:bg-dark-300 focus:text-blue-100"
        >
          can view
        </SelectItem>
        <SelectItem
          value="editor"
          className="cursor-pointer bg-dark-200 text-blue-100 focus:bg-dark-300 focus:text-blue-100"
        >
          can edit
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
