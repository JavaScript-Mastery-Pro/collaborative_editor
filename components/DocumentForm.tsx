'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { createDocument } from '@/lib/actions/room.actions';

import { Button } from './ui/button';

export const DocumentForm = ({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) => {
  const router = useRouter();

  const createDocumentHandler = async () => {
    try {
      const room = await createDocument({
        userId,
        email,
      });

      if (room) router.push(`/documents/${room.id}`);
    } catch (error) {
      console.log('Error notif:', error);
    }
  };
  return (
    <div>
      <Button type="submit" onClick={createDocumentHandler}>
        Create New
      </Button>
    </div>
  );
};
