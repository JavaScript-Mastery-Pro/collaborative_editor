import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getDocuments } from "@/lib/actions/room.actions";
import { dateConverter } from "@/lib/utils";

import { AddDocumentBtn } from "@/components/AddDocumentBtn ";
import { DeleteModal } from "@/components/DeleteModal";
import { Header } from "@/components/Header";
import { Notifications } from "@/components/Notifications";

const Documents = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const roomDocuments = await getDocuments(
    clerkUser.emailAddresses[0].emailAddress
  );

  return (
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <Notifications />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>

      {/* Document list */}
      {roomDocuments.data.length > 0 ? (
        <div className="document-list-container">
          <div className="document-list-title">
            <h3 className="text-28-semibold">All documents</h3>
            <AddDocumentBtn
              userId={clerkUser.id}
              email={clerkUser.emailAddresses[0].emailAddress}
            />
          </div>
          <ul className="document-ul">
            {roomDocuments.data.map((document: any) => (
              <li key={document.id} className="document-list-item">
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
            ))}
          </ul>
        </div>
      ) : (
        // Empty state
        <div className="document-list-empty">
          <Image
            src="/assets/icons/doc.svg"
            alt="file"
            width={40}
            height={40}
            className="mx-auto"
          />

          <AddDocumentBtn
            userId={clerkUser.id}
            email={clerkUser.emailAddresses[0].emailAddress}
          />
        </div>
      )}
    </main>
  );
};

export default Documents;
