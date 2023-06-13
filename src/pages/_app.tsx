import type { NextPage } from 'next';
import type { AppType, AppProps } from 'next/app';
import { ReactElement, ReactNode, useEffect } from 'react';
import { DefaultLayout } from '~/components/DefaultLayout';
import { trpc } from '~/utils/trpc';
import { Navbar, NextUIProvider, Text, Button } from '@nextui-org/react';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  ExtendedQueryBlockResponse,
  latestBlocks,
  latestBlock,
  latestHeight,
  latestBlockHeight,
} from '~/utils/appState';
import { useAtom, useAtomValue } from 'jotai';
dayjs.extend(relativeTime);

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

  const [height, setHeight] = useAtom(latestHeight);
  const [blocks, setBlocks] = useAtom(latestBlocks);
  const lBlock = useAtomValue(latestBlock);
  const lBlockHeight = useAtomValue(latestBlockHeight);
  heightQueryDataPresent && setHeight(BigInt(heightQuery.data.height));

  const latestBlockQuery = trpc.rpc.queryBlock.useQuery({
    height: height,
  });

  useEffect(() => {
    console.log('latestBlockHeight: ' + lBlockHeight);
    console.log(latestBlock);

    if (lBlockHeight === undefined || height > lBlockHeight) {
      // Get new block and add it to latestBlocks.
      const block = latestBlockQuery.data as ExtendedQueryBlockResponse;
      if (latestBlockQuery.data) {
        setBlocks((prevBlocks) => {
          const newBlocks = [...prevBlocks, block];
          if (newBlocks.length > 3) {
            // If more than 3 blocks, remove the oldest one(s).
            return newBlocks.slice(-3);
          } else {
            // TODO: populate with historical data.
            return newBlocks;
          }
        });
      }
    }
  }, [height, blocks, setBlocks, lBlock, latestBlockQuery, lBlockHeight]); // this array of dependencies tells React to run the effect whenever `height` changes

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
