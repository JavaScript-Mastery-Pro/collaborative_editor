'use server';

import { Liveblocks } from '@liveblocks/node';
import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { parseStringify } from '../utils';

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
});

// Create new document
export const createDocument = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  const roomId = nanoid();

  try {
    const metadata = {
      userId,
      email,
      userType: 'creator',
      title: 'Untitled',
    };

    const usersAccesses: RoomAccesses = {
      [userId]: ['room:write'],
    };

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: [], // [] means private room
    });

    revalidatePath('/documents');
    return parseStringify(room);
  } catch (error) {
    console.error('An error occurred while creating a room:', error);
  }
};

// Get one document
export const getDocument = async (roomId: string) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    return parseStringify(room);
  } catch (error) {
    console.error('An error occurred while retrieving a room:', error);
  }
};

// Get multiple documents filtered by users accesses
export const getDocuments = async (userId: string) => {
  try {
    const rooms = await liveblocks.getRooms({ userId });

    return parseStringify(rooms);
  } catch (error) {
    console.error('An error occurred while retrieving rooms:', error);
  }
};

// Update document title
export const updateDocument = async (roomId: string, title: string) => {
  try {
    const room = await liveblocks.updateRoom(roomId, {
      metadata: {
        title,
      },
    });

    revalidatePath(`/documents/${roomId}`);
    return parseStringify(room);
  } catch (error) {
    console.error(
      'An error occurred while updating the document title:',
      error
    );
  }
};

// Delete one document
export const deleteDocument = async (roomId: string) => {
  try {
    liveblocks.deleteRoom(roomId);
  } catch (error) {
    console.error('An error occurred while deleting a room:', error);
  } finally {
    revalidatePath('/documents');
    redirect('/documents');
  }
};

// Share document access - Edit (['room:write']) or Read (['room:read', 'room:presence:write'])
export const shareDocumentAccess = async ({
  roomId,
  userId,
  email,
  title,
  userType,
  accessType,
}: UpdateDocumentParams) => {
  try {
    const metadata = {
      userId,
      email,
      title,
      userType,
      accessType,
    };

    const usersAccesses: RoomAccesses = {
      [email]: accessType,
    };
    const rooms = await liveblocks.updateRoom(roomId, {
      metadata,
      usersAccesses,
    });

    return parseStringify(rooms);
  } catch (error) {
    console.error('An error occurred while sharing the document:', error);
  }
};
