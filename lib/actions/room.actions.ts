'use server';

import console from 'console';

import { Liveblocks } from '@liveblocks/node';
import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getAccessType, parseStringify } from '../utils';

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
      creatorId: userId,
      email,
      title: 'Untitled',
    };

    const usersAccesses: RoomAccesses = {
      [email]: ['room:write'],
    };

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: [], // [] means private room
    });

    revalidatePath('/');
    return parseStringify(room);
  } catch (error) {
    console.error('An error occurred while creating a room:', error);
  }
};

// Get one document
export const getDocument = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    // Check if the user has access to the document's room
    const hasAccess = Object.keys(room.usersAccesses).includes(userId);

    if (!hasAccess) {
      throw new Error('You do not have access to this document.');
    }

    return parseStringify(room);
  } catch (error) {
    console.error('An error occurred while retrieving a room:', error);
  }
};

// Get multiple documents filtered by users accesses
export const getDocuments = async (email: string) => {
  try {
    const rooms = await liveblocks.getRooms({ userId: email });

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
    revalidatePath('/');
    redirect('/');
  }
};

// Share document access - Edit (['room:write']) or Read (['room:read', 'room:presence:write'])
export const shareDocumentAccess = async ({
  roomId,
  email,
  userType,
}: ShareDocumentParams) => {
  try {
    const usersAccesses: RoomAccesses = {
      [email]: getAccessType(userType) as AccessType,
    };

    const room = await liveblocks.updateRoom(roomId, {
      usersAccesses,
    });

    revalidatePath(`/documents/${roomId}`);
    return parseStringify(room);
  } catch (error) {
    console.error('An error occurred while sharing the document:', error);
  }
};

export const removeCollaborator = async ({
  roomId,
  email,
}: {
  roomId: string;
  email: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    if (room.metadata.email === email) {
      throw new Error(
        'You cannot remove the creator from the collaborators list.'
      );
    }

    const updatedRoom = await liveblocks.updateRoom(roomId, {
      usersAccesses: { [email]: null },
    });

    // console.log({ usersAccesses });
    console.log({ updatedRoom });

    revalidatePath(`/documents/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    console.error('An error occurred while sharing the document:', error);
  }
};
