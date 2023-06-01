import type { NextPage } from 'next';
import type { AppType, AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import { DefaultLayout } from '~/components/DefaultLayout';
import { trpc } from '~/utils/trpc';
import { Navbar, NextUIProvider, Text, Button } from '@nextui-org/react';

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export type NextPageWithLayout<
  TProps = Record<string, unknown> & { height: bigint },
  TInitialProps = TProps,
> = NextPage<TProps, TInitialProps> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = (({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

  const networkNameQuery = trpc.settings.useQuery();

  const heightQuery = trpc.rpc.height.useQuery(undefined, { refetchInterval: 1000 });
  pageProps.height = (heightQuery.data?.height !== null && heightQuery.data?.height !== undefined) ? BigInt(heightQuery.data?.height) : BigInt(0);

  if (heightQuery.error) {
    return getLayout(<NextUIProvider>error: {JSON.stringify(heightQuery.error.data)}</NextUIProvider>);
  }

  // if (height.data?.height !== null && height.data?.height !== undefined) {
  return getLayout(<NextUIProvider>
    <Navbar isBordered variant="floating">
      <Navbar.Brand>
        <Text b color="inherit" hideIn="xs">
          {networkNameQuery.data?.networkName}
        </Text>
      </Navbar.Brand>
      <Navbar.Content hideIn="xs" variant="highlight-rounded">
        <Navbar.Link href="/">Dashboard</Navbar.Link>
        <Navbar.Link href="/control-plane">Control plane</Navbar.Link>
      </Navbar.Content>
      <Navbar.Content>
        Height: {pageProps.height.toString()}
      </Navbar.Content>
    </Navbar>
    <Component {...pageProps} /></NextUIProvider>);
  // } else {
  //   return getLayout(<NextUIProvider>waiting for latest height..</NextUIProvider>);
  // }
}) as AppType;

export default trpc.withTRPC(MyApp);
