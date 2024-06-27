import { getDocument } from '@/lib/actions/room.actions';

import { CollaborativeApp } from '@/components/CollaborativeApp';
import { Room } from '@/components/Room';

const Document = async ({ params: { id } }: SearchParamProps) => {
  const room = await getDocument(id);

  return (
    <main className="flex w-full flex-col items-center">
      <Room roomId={id}>
        <CollaborativeApp
          roomId={id}
          roomMetadata={room.metadata}
          usersAccesses={room.usersAccesses}
        />
      </Room>
    </main>
  );
};

export default Document;
