'use client';
import { ValidatorTable } from '~/components/ValidatorTable';
import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import { StatsCard } from '~/components/StatsCard';
import { parsePocketBlockDate } from '~/utils/misc';
import { NetworkInfoCard } from '~/components/NetworkInfoCard';
import { latestBlock, latestHeight } from '~/utils/appState';
import { useAtomValue } from 'jotai';

const IndexPage: NextPageWithLayout = () => {
  const lBlock = useAtomValue(latestBlock);
  const height = useAtomValue(latestHeight);

  const valdatorCountQuery = trpc.rpc.listValidators.useQuery({
    height,
    page: 1,
  });

  const applicationCountQuery = trpc.rpc.listApplications.useQuery({
    height,
    page: 1,
  });

  // TODO: figure out why `block_header` is returned from rpc, but not just `block`.
  const blockHeader = lBlock?.block_header;
  const latestBlockTs = blockHeader?.timestamp
    ? parsePocketBlockDate(blockHeader.timestamp)
    : null;

  return (
    <>
      <div className={'columns-6 justify-center'}>
        <div>
          <StatsCard title="Latest block" value={height} />
        </div>
        <div>
          <StatsCard
            title="Since last block"
            value={latestBlockTs ? latestBlockTs.fromNow() : 'N/A'}
          />
        </div>
        <div>
          <StatsCard title="Relays in last block" value={'N/A'} />
        </div>
        <div>
          <StatsCard title="Rewards in last block" value={'N/A'} />
        </div>
        <div>
          <StatsCard
            title="Number of applications"
            value={applicationCountQuery.data?.total_apps || 'N/A'}
          />
        </div>
        <div>
          <StatsCard
            title="Number of nodes"
            value={valdatorCountQuery.data?.total_validators || 'N/A'}
          />
        </div>
      </div>
      <div className={' mt-5'}>
        <NetworkInfoCard />
      </div>
      <div className={' mt-5'}>
        <ValidatorTable height={height} />
      </div>
    </>
  );
};

export default IndexPage;

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @link https://trpc.io/docs/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createServerSideHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.post.all.fetch();
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
