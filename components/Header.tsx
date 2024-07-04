import { SignedIn, UserButton } from '@clerk/nextjs';
import Image from 'next/image';

import { Notifications } from './Notifications';

export const Header = () => {
  return (
    <div className="sticky left-0 top-0 flex w-full justify-center bg-dark-100 px-4">
      <div className="flex h-[92px] w-full max-w-7xl items-center justify-between">
        <div className=" flex items-center gap-1 ">
          <Image
            src="/assets/icons/doc.svg"
            alt="file"
            width={32}
            height={32}
          />
          <p className="pt-1 text-[20px] font-semibold text-[#2196f3]">Docs</p>
        </div>
        <div className="flex items-center gap-2 lg:gap-4">
          <Notifications />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </div>
  );
};
