import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';

import { cn } from '@/lib/utils';

import { Provider } from './Provider';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'LiveDocs',
  description:
    'A collaborative text editor that leverages Liveblocks and Lexical to offer a real-time, feature-rich platform for creating, editing, and sharing documents.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: '#3371FF', fontSize: '16px' },
      }}
    >
      <html lang="en">
        <body
          className={cn(
            'min-h-screen font-sans antialiased',
            fontSans.variable,
          )}
        >
          <Provider>{children}</Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
