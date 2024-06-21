import { currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import { redirect } from "next/navigation";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
});

export async function POST(request: Request) {
  // Get the current user from your database
  const clerkUser = await currentUser();

  if (!clerkUser) redirect("/sign-in");

  console.log({ clerkUser });

  const user = {
    id: clerkUser.id,
    info: {
      name: `${clerkUser.firstName} ${clerkUser.lastName}`,
      email: clerkUser.emailAddresses[0].emailAddress,
      avatar: clerkUser.imageUrl,
    },
  };

  // Start an auth session inside your endpoint
  const session = liveblocks.prepareSession(
    user.id,
    { userInfo: user.info } // Optional
  );

  // Use a naming pattern to allow access to rooms with wildcards
  // Giving the user read access on their org, and write access on their group
  session.allow("my-room", session.FULL_ACCESS);
  // session.allow(`${user.organization}:${user.group}:*`, session.FULL_ACCESS);

  // Authorize the user and return the result
  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
