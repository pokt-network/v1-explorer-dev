import type { NextPage } from 'next';
import type { AppType, AppProps } from 'next/app';
import { ReactElement, ReactNode, useEffect } from 'react';
import { DefaultLayout } from '~/components/DefaultLayout';
import { trpc } from '~/utils/trpc';
import { Navbar, NextUIProvider, Text } from '@nextui-org/react';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {
  ExtendedQueryBlockResponse,
  latestBlock,
  latestHeight,
  latestBlockHeight,
  addBlock,
} from '~/utils/appState';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export type NextPageWithLayout<
  TProps = Record<string, unknown>,
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
  const heightQuery = trpc.rpc.height.useQuery(undefined, {
    refetchInterval: 3000,
  });
  const heightQueryDataPresent =
    heightQuery.data &&
    heightQuery.data.height !== null &&
    heightQuery.data.height !== undefined;

  // Connect app state with the Pocket RPC.
  const [height, setHeight] = useAtom(latestHeight);
  heightQueryDataPresent && setHeight(BigInt(heightQuery.data.height));
  const lBlockHeight = useAtomValue(latestBlockHeight);
  const addLatestBlock = useSetAtom(addBlock);

  const latestBlockQuery = trpc.rpc.queryBlock.useQuery({
    height: height,
  });

  // Update latest block when height changes.
  useEffect(() => {
    console.log('latestBlockHeight: ' + lBlockHeight);
    console.log(latestBlock);

    if (lBlockHeight === undefined || height > lBlockHeight) {
      // Get new block and add it to latestBlocks.
      const block = latestBlockQuery.data as ExtendedQueryBlockResponse;
      if (latestBlockQuery.data) {
        addLatestBlock(block);
      }
    }
  }, [height, latestBlockQuery, lBlockHeight, addLatestBlock]);

  // Update a list of all actors when a new block is added.
  useEffect(() => {
    console.log('new latestBlockHeight: ' + lBlockHeight);
  }, [lBlockHeight]);

  const errorMessage = heightQuery.error ? (
    <Text>error: {JSON.stringify(heightQuery.error)}</Text>
  ) : null;

  if (heightQueryDataPresent) {
    return getLayout(
      <NextUIProvider>
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
          <Navbar.Content>Height: {height.toString()}</Navbar.Content>
        </Navbar>
        <Component />
      </NextUIProvider>,
    );
  } else {
    return getLayout(
      <NextUIProvider>
        <Text>Waiting for latest height.</Text>
        <Text>
          Make sure the Pocket PRC port is reachable, and check the logs.
        </Text>
        {errorMessage}
      </NextUIProvider>,
    );
  }
}) as AppType;

export default trpc.withTRPC(MyApp);
