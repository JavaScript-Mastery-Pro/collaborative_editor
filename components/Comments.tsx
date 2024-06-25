import { useThreads } from '@liveblocks/react/suspense';
import { Thread, Composer } from '@liveblocks/react-ui';

export const Comments = () => {
  const { threads } = useThreads();

  return (
    <div className="space-y-5">
      <Composer className="w-[300px] rounded-lg" />

      {threads.map((thread) => (
        <Thread
          key={thread.id}
          thread={thread}
          className="w-[300px] !rounded-lg"
        />
      ))}
    </div>
  );
};
