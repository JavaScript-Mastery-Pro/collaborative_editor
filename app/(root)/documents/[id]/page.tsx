import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { getDocument } from '@/lib/actions/room.actions';
import { getClerkUsers } from '@/lib/actions/user.actions';

import { CollaborativeApp } from '@/components/CollaborativeApp';
import { Room } from '@/components/Room';

const Document = async ({ params: { id } }: SearchParamProps) => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/sign-in');

  const room = await getDocument({
    roomId: id,
    userId: clerkUser.emailAddresses[0].emailAddress,
  });

  const userIds = Object.keys(room.usersAccesses);

  const users = await getClerkUsers(userIds);

  if (!room) redirect('/');

  return (
    <main className="flex w-full flex-col items-center">
      <Room roomId={id}>
        <CollaborativeApp
          roomId={id}
          roomMetadata={room.metadata}
          users={users}
        />
      </Room>
    </main>
  );
};

export default Document;
