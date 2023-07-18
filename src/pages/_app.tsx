import type { NextPage } from 'next';
import type { AppType, AppProps } from 'next/app';
import NextLink from 'next/link';
import { ReactElement, ReactNode, useEffect } from 'react';
import { DefaultLayout } from '~/components/DefaultLayout';
import { trpc } from '~/utils/trpc';
import { NextUIProvider } from '@nextui-org/react';

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

import '../styles/globals.css';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react';
import { Link } from '@nextui-org/react';

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
    Component.getLayout ??
    ((page) => (
      <NextUIProvider>
        <DefaultLayout>{page}</DefaultLayout>
      </NextUIProvider>
    ));

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
    if (lBlockHeight === undefined || height > lBlockHeight) {
      // Get new block and add it to latestBlocks.
      const block = latestBlockQuery.data as ExtendedQueryBlockResponse;
      if (latestBlockQuery.data) {
        addLatestBlock(block);
      }
    }
  }, [height, latestBlockQuery, lBlockHeight, addLatestBlock]);

  const errorMessage = heightQuery.error ? (
    <p>error: {JSON.stringify(heightQuery.error)}</p>
  ) : null;

  if (heightQueryDataPresent) {
    return getLayout(
      <>
        <Navbar isBordered>
          <NavbarBrand>
            <p color="inherit">{networkNameQuery.data?.networkName}</p>
          </NavbarBrand>
          <NavbarContent justify="center">
            <NavbarItem>
              <Link href="/" as={NextLink}>
                Dashboard
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/control-plane" as={NextLink}>
                Control plane
              </Link>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify={'end'}>
            Height: {height.toString()}
          </NavbarContent>
        </Navbar>

        <div className={'container mx-auto mt-5'}>
          <Component />
        </div>
      </>,
    );
  } else {
    return getLayout(
      <>
        <p>Waiting for latest height.</p>
        <p>Make sure the Pocket PRC port is reachable, and check the logs.</p>
        {errorMessage}
      </>,
    );
  }
}) as AppType;

export default trpc.withTRPC(MyApp);
