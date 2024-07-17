import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

export const Header = ({ children, className }: HeaderProps) => {
  return (
    <div className={cn('header', className)}>
      <Link href="/" className="md:w-[150px]">
        <Image
          src="/assets/icons/logo.svg"
          alt="file"
          width={120}
          height={32}
          className="hidden md:block"
        />
        <Image
          src="/assets/icons/logo-icon.svg"
          alt="file"
          width={32}
          height={32}
          className="mr-2 md:hidden"
        />
      </Link>
      {children}
    </div>
  );
};
