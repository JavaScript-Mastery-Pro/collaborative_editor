'use client';

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
import { Label } from '@/components/ui/label';

type ShareDocumentDialogProps = {
  roomId: string;
};

export const ShareDocument = ({ roomId }: ShareDocumentDialogProps) => {
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false);

  const shareDocumentHandler = async () => {
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
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Share</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share document</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input
            id="email"
            placeholder="Enter email"
            value={email}
            className="focus-visible:ring-0 focus-visible:ring-offset-0"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={shareDocumentHandler}>
            Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
