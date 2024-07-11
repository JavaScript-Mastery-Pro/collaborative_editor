import { useOthers } from '@liveblocks/react/suspense';
import Image from 'next/image';

export const ActiveCollaborators = () => {
  const others = useOthers();

  const otherUsers = others.map((other) => other.info);

  return (
    <ul className="hidden items-center justify-end -space-x-3 overflow-hidden sm:flex">
      {otherUsers.map((user, i) => {
        return (
          <li key={user.id + 1}>
            <Image
              src={user.avatar}
              alt={user.name}
              width={100}
              height={100}
              className="inline-block size-8 rounded-full ring-2 ring-dark-100"
              style={{ border: `3px solid ${user.color}` }}
            />
          </li>
        );
      })}
    </ul>
  );
};
