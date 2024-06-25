'use server';

import { createClerkClient } from '@clerk/clerk-sdk-node';

import { parseStringify } from '../utils';

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY as string,
});

export const getClerkUsers = async (userIds?: string[]) => {
  try {
    const query = userIds
      ? {
          emailAddress: userIds,
        }
      : {};

    const { data } = await clerkClient.users.getUserList(query);

    const users = data.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      avatar: user.imageUrl,
    }));

    return parseStringify(users);
  } catch (error) {
    console.error(
      'An error occurred while retrieving users from Clerk:',
      error
    );
  }
};
