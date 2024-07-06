import { currentUser } from '@clerk/nextjs/server';
import { Liveblocks } from '@liveblocks/node';
import { redirect } from 'next/navigation';

import { getUserColor } from '@/lib/utils';

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
});

export async function POST() {
  const clerkUser = await currentUser();

  if (!clerkUser) redirect('/sign-in');

  console.log('color', getUserColor(clerkUser.id));

  const user = {
    id: clerkUser.id,
    info: {
      id: clerkUser.id,
      name: `${clerkUser.firstName} ${clerkUser.lastName}`,
      email: clerkUser.emailAddresses[0].emailAddress,
      avatar: clerkUser.imageUrl,
      color: getUserColor(clerkUser.id),
    },
  };

  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.info.email, // Info stored in liveblock's userAccess
      groupIds: [],
    },
    { userInfo: user.info },
  );

  return new Response(body, { status });
}
