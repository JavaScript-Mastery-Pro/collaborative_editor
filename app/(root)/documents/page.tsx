import { SignedIn, UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getDocuments } from '@/lib/actions/room.actions';

import { DocumentForm } from '@/components/DocumentForm';

const Documents = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/sign-in');

  const roomDocuments = await getDocuments(clerkUser.id);

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex w-full items-center justify-between border p-5">
        <DocumentForm
          userId={clerkUser.id}
          email={clerkUser.emailAddresses[0].emailAddress}
        />

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
      <ul className="flex w-full flex-col rounded-lg  p-5">
        {roomDocuments.data.map((document: any) => {
          return (
            <Link key={document.id} href={`/documents/${document.id}`}>
              <p className="border-b border-gray-300/50 py-3">
                {' '}
                <span className="font-bold">
                  {document.metadata.title}{' '}
                </span> | {document.id}
              </p>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default Documents;
