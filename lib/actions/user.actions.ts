'use server';

import { createClerkClient } from '@clerk/clerk-sdk-node';

import { liveblocks } from '@/lib/liveblocks';

import { parseStringify } from '../utils';

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY as string,
});

// Get Clerk Users
export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
  try {
    // https://clerk.com/docs/references/backend/user/get-user-list#filter-by-email-addresses-and-phone-numbers
    const { data } = await clerkClient.users.getUserList({
      emailAddress: userIds,
    });

    const users = data.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      avatar: user.imageUrl,
    }));

    // Sort users by the order of the userIds to make sure the order is consistent with userIds
    const sortedUsers = userIds.map((email) =>
      users.find((user) => user.email === email),
    );

    return parseStringify(sortedUsers);
  } catch (error) {
    console.error(
      'An error occurred while retrieving users from Clerk:',
      error,
    );
  }
};

// Get document users
export const getDocumentUsers = async ({
  roomId,
  currentUser,
  text,
}: {
  roomId: string;
  currentUser: string;
  text: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    let users = Object.keys(room.usersAccesses).filter(
      (email) => email !== currentUser,
    );

    if (text.length) {
      const loweredText = text.toLowerCase();
      users = users.filter((email: string) =>
        email.toLowerCase().includes(loweredText),
      );
    }

    return parseStringify(users);
  } catch (error) {
    console.error(
      'An error occurred while retrieving the list of room users:',
      error,
    );
  }
};
