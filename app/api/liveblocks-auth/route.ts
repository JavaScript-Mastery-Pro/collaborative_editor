import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { liveblocks } from '@/lib/liveblocks';
import { getUserColor } from '@/lib/utils';

export async function POST() {
  const clerkUser = await currentUser();

  if (!clerkUser) redirect('/sign-in');

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
