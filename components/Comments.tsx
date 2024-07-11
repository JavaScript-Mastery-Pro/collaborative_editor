import { BaseMetadata, ThreadData } from '@liveblocks/client';
import { useThreads } from '@liveblocks/react/suspense';
import { useIsThreadActive } from '@liveblocks/react-lexical';
import { Thread, Composer } from '@liveblocks/react-ui';

import { cn } from '@/lib/utils';

export const Comments = () => {
  const { threads } = useThreads();

  return (
    <div className="comments-container flex w-full flex-col items-center justify-center">
      <Composer className="comment-composer" />

      {threads.map((thread) => (
        <ThreadWrapper key={thread.id} thread={thread} />
      ))}
    </div>
  );
};

const ThreadWrapper = ({ thread }: { thread: ThreadData<BaseMetadata> }) => {
  const isActive = useIsThreadActive(thread.id); // Text with attached comments will make the comment Thread active when clicked

  return (
    <Thread
      thread={thread}
      data-state={isActive ? 'active' : null}
      className={cn(
        'comment-thread',
        isActive && 'border-blue-500 shadow-md',
        thread.resolved && 'opacity-40',
      )}
    />
  );
};
