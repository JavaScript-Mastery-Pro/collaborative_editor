import { useThreads } from '@liveblocks/react/suspense';
import { useIsThreadActive } from '@liveblocks/react-lexical';
import { Thread, Composer } from '@liveblocks/react-ui';

import { cn } from '@/lib/utils';

export const Comments = () => {
  const { threads } = useThreads();

  return (
    <div className="comments-container">
      <Composer className="comment-composer" />

      {threads.map((thread) => (
        <ThreadWrapper key={thread.id} thread={thread} />
      ))}
    </div>
  );
};

const ThreadWrapper = ({ thread }: ThreadWrapperProps) => {
  const isActive = useIsThreadActive(thread.id); // Text with attached comments will make the comment Thread active when clicked

  return (
    <Thread
      thread={thread}
      data-state={isActive ? 'active' : null}
      className={cn(
        'comment-thread border',
        isActive && '!border-blue-500 shadow-md',
        thread.resolved && 'opacity-40',
      )}
    />
  );
};
