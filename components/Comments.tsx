import { BaseMetadata, ThreadData } from '@liveblocks/client';
import { useThreads } from '@liveblocks/react/suspense';
import { useIsThreadActive } from '@liveblocks/react-lexical';
import { Thread, Composer } from '@liveblocks/react-ui';

import { cn } from '@/lib/utils';

export const Comments = () => {
  const { threads } = useThreads();

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4 lg:w-fit ">
      <Composer className="w-full max-w-[800px] bg-dark-200 shadow-sm lg:w-[350px]" />

      {threads.map((thread) => (
        <ThreadWrapper key={thread.id} thread={thread} />
      ))}
    </div>
  );
};

const ThreadWrapper = ({ thread }: { thread: ThreadData<BaseMetadata> }) => {
  const isActive = useIsThreadActive(thread.id);

  console.log('isActive', isActive);

  return (
    <Thread
      thread={thread}
      data-state={isActive ? 'active' : null}
      className={cn(
        'w-full max-w-[800px] border bg-dark-200 shadow-sm lg:w-[350px] transition-all',
        isActive && 'border-[#2196f3] !bg-red-500 shadow-md',
      )}
    />
  );
};
