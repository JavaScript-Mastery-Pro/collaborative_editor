import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getDocuments } from '@/lib/actions/room.actions';
import { dateConverter } from '@/lib/utils';

import { CreateDocument } from '@/components/CreateDocument';
import { DeleteModal } from '@/components/DeleteModal';
import { Header } from '@/components/Header';

const Documents = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/sign-in');

  const roomDocuments = await getDocuments(
    clerkUser.emailAddresses[0].emailAddress,
  );

  return (
    <main className="flex min-h-screen w-full flex-col items-center gap-5 sm:gap-10">
      {/* Header */}
      <Header />

      {/* Document list */}
      {roomDocuments.data.length > 0 ? (
        <div className="mb-10 flex w-full flex-col items-center gap-10 px-4">
          <div className="flex w-full max-w-[730px] items-end justify-between">
            <h3 className="text-[28px] font-semibold">All documents</h3>
            <CreateDocument
              userId={clerkUser.id}
              email={clerkUser.emailAddresses[0].emailAddress}
            />
          </div>
          <ul className="flex w-full max-w-[730px] flex-col gap-5">
            {roomDocuments.data.map((document: any) => {
              return (
                <li
                  key={document.id}
                  className=" flex items-center justify-between gap-4 rounded-lg bg-doc bg-cover p-5 shadow-xl"
                >
                  <Link
                    href={`/documents/${document.id}`}
                    className="flex flex-1 items-center gap-4"
                  >
                    <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                      <Image
                        src="/assets/icons/doc.svg"
                        alt="file"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="line-clamp-1 text-lg">
                        {document.metadata.title}
                      </p>
                      <p className="text-sm font-light text-blue-100">
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
        // Empty state
        <div className="flex w-full max-w-[730px] flex-col items-center justify-center gap-3 rounded-lg border bg-[#f8f8f8] px-10 py-8">
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
