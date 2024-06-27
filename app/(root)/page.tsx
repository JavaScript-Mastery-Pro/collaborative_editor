import { SignedIn, UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getDocuments } from '@/lib/actions/room.actions';
import { dateConverter } from '@/lib/utils';

import { CreateDocument } from '@/components/CreateDocument';
import { DeleteModal } from '@/components/DeleteModal';

const Documents = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/sign-in');

  const roomDocuments = await getDocuments(
    clerkUser.emailAddresses[0].emailAddress
  );

  return (
    <main className="flex min-h-screen w-full flex-col items-center gap-5 sm:gap-10">
      <div className="flex h-[64px] w-full items-center justify-between border-b bg-white px-4">
        <div className=" flex items-center gap-1 ">
          <Image
            src="/assets/icons/doc.svg"
            alt="file"
            width={32}
            height={32}
          />
          <p className="pt-1 text-[20px] font-semibold text-[#2196f3]">Docs</p>
        </div>
        <div className="flex items-center gap-2">
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
      {roomDocuments.data.length > 0 ? (
        <div className="flex w-full flex-col items-center gap-5 px-4">
          <div className="flex w-full max-w-[730px] items-end justify-between">
            <h3 className="text-[20px] font-semibold text-[#444] sm:px-4">
              All documents
            </h3>
            <CreateDocument
              userId={clerkUser.id}
              email={clerkUser.emailAddresses[0].emailAddress}
            />
          </div>
          <ul className="flex w-full max-w-[730px] flex-col border-t sm:rounded-lg sm:border">
            {roomDocuments.data.map((document: any) => {
              return (
                <li
                  key={document.id}
                  className="group flex items-center justify-between gap-4 border-b border-gray-300/40 py-4  sm:p-4 sm:last:border-b-0"
                >
                  <Link
                    href={`/documents/${document.id}`}
                    className="flex flex-1 items-center gap-4"
                  >
                    <div className="hidden rounded-md border border-gray-300/40 bg-[#f8f8f8] p-2 py-3 sm:block">
                      <Image
                        src="/assets/icons/doc.svg"
                        alt="file"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="relative">
                      <p className="line-clamp-1 font-semibold text-[#444] transition-all group-hover:text-[#2196f3]">
                        {document.metadata.title}
                      </p>
                      <p className="text-sm text-gray-400">
                        Created about {dateConverter(document.createdAt)}
                      </p>
                    </div>
                  </Link>
                  <DeleteModal roomId={document.id} />
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="flex w-full max-w-[500px] flex-col items-center justify-center gap-3 rounded-lg border bg-[#f8f8f8] px-10 py-8">
          <Image
            src="/assets/icons/doc.svg"
            alt="file"
            width={40}
            height={40}
            className="mx-auto grayscale"
          />
          <p className="mb-2 text-sm text-gray-400">Create a new document</p>
          <CreateDocument
            userId={clerkUser.id}
            email={clerkUser.emailAddresses[0].emailAddress}
          />
        </div>
      )}
    </main>
  );
};

export default Documents;
