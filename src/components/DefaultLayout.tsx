import Head from 'next/head';
import { ReactNode } from 'react';
import { NextUIProvider } from '@nextui-org/react';

type DefaultLayoutProps = { children: ReactNode };

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <NextUIProvider>
      <Head>
        <title>Pocket Dev Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>{children}</main>
    </NextUIProvider>
  );
};
