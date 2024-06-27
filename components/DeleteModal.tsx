'use client';

import Image from 'next/image';
import { useState } from 'react';

import { deleteDocument } from '@/lib/actions/room.actions';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from './ui/button';

export const DeleteModal = ({ roomId }: { roomId: string }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const deleteDocumentHandler = async () => {
    setLoading(true);

    try {
      await deleteDocument(roomId);
      setOpen(false);
    } catch (error) {
      console.log('Error notif:', error);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="min-w-9 rounded-xl bg-transparent p-2 transition-all hover:bg-[#eee]">
          <Image
            src="/assets/icons/delete.svg"
            alt="more"
            width={20}
            height={20}
            className="size-5"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[400px] rounded-xl">
        <DialogHeader>
          <DialogTitle>Delete document</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this document?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-5">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>

          <Button variant="destructive" onClick={deleteDocumentHandler}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
