/* eslint-disable no-unused-vars */
declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type RoomAccesses = Record<
  string,
  ['room:write'] | ['room:read', 'room:presence:write']
>;

declare type UserType = 'creator' | 'editor' | 'viewer';

declare type AccessType = ['room:write'] | ['room:read', 'room:presence:write'];

declare type RoomMetadata = {
  userId: string;
  email: string;
  userType: UserType;
  title: string;
};

declare type CreateDocumentParams = {
  userId: string;
  email: string;
};

declare type UpdateDocumentParams = {
  roomId: string;
  userId: string;
  email: string;
  title: string;
  userType: UserType;
  accessType: AccessType;
};
