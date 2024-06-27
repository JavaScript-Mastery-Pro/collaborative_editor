import { useThreads } from '@liveblocks/react/suspense';
import { Thread, Composer } from '@liveblocks/react-ui';

export const Comments = () => {
  const { threads } = useThreads();

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4 lg:w-fit ">
      <Composer className="w-full max-w-[800px] shadow-sm lg:w-[350px]" />

      {threads.map((thread) => (
        <Thread
          key={thread.id}
          thread={thread}
          className="w-full max-w-[800px] shadow-sm lg:w-[350px]"
        />
      ))}
    </div>
  );
};
