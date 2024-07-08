'use client';

import { useInboxNotifications } from '@liveblocks/react/suspense';
import { InboxNotification, InboxNotificationList } from '@liveblocks/react-ui';
import Image from 'next/image';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export const Notifications = () => {
  const { inboxNotifications } = useInboxNotifications();

  const unreadNotifications = inboxNotifications.filter(
    (notification) => !notification.readAt, // Filter unread notifications
  );

  console.log({ inboxNotifications });

  return (
    <Popover>
      <PopoverTrigger className="flex size-10 items-center justify-center rounded-lg">
        <Image
          src="/assets/icons/bell.svg"
          alt="inbox"
          width={24}
          height={24}
        />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[460px] border-none bg-dark-200 shadow-lg"
      >
        <InboxNotificationList>
          {unreadNotifications.length <= 0 && (
            <p className="py-2 text-center text-dark-500">
              No notifications yet
            </p>
          )}

          {unreadNotifications.length > 0 &&
            unreadNotifications.map((inboxNotification) => (
              <InboxNotification
                key={inboxNotification.id}
                inboxNotification={inboxNotification}
                className="bg-dark-200 text-white"
                href={`/documents/${inboxNotification.roomId}`}
                showActions={false}
                kinds={{
                  thread: (props) => (
                    <InboxNotification.Thread
                      {...props}
                      showRoomName={false}
                      showActions={false}
                    />
                  ),
                  textMention: (props) => {
                    console.log(props);
                    return (
                      <InboxNotification.TextMention
                        {...props}
                        showRoomName={false}
                      />
                    );
                  },
                  $documentAccess: (props) => {
                    const { title, avatar } =
                      props.inboxNotification.activities[0].data;

                    return (
                      <InboxNotification.Custom
                        {...props}
                        title={title}
                        aside={
                          <InboxNotification.Icon className="bg-transparent">
                            <Image
                              src={(avatar as string) || ''}
                              width={36}
                              height={36}
                              alt="avatar"
                              className="rounded-full"
                            />
                          </InboxNotification.Icon>
                        }
                      >
                        <></>
                      </InboxNotification.Custom>
                    );
                  },
                }}
              />
            ))}
        </InboxNotificationList>
      </PopoverContent>
    </Popover>
  );
};
