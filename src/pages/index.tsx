import { ValidatorTable } from '~/components/ValidatorTable';
import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import { Grid, Container, Table, Card } from "@nextui-org/react";
import { StatsCard } from '~/components/StatsCard';
import { parsePocketBlockDate } from '~/utils/misc';
import { NetworkInfoCard } from '~/components/NetworkInfoCard';

const IndexPage: NextPageWithLayout = ({ height }) => {
  // const latestBlockQuery = trpc.block.latest.useQuery();
  const latestBlockQuery = trpc.rpc.queryBlock.useQuery({ height }, { refetchInterval: 1000 });
  const valdatorCountQuery = trpc.rpc.listValidators.useQuery({ height, page: 1 });
  // TODO: figure out why `block_header` is returned from rpc, but not just `block`.
  const latestBlockTs = latestBlockQuery.data?.block_header?.timestamp ? parsePocketBlockDate(latestBlockQuery.data?.block_header?.timestamp) : null

  console.log(latestBlockQuery.data?.block_header?.timestamp + ' -> ' + latestBlockTs?.toISOString())

  return (
    <>
      <Container>
        <Grid.Container gap={2} justify="center">
          <Grid xs={3}>
            <StatsCard title="Latest block" value={height} />
          </Grid>
          <Grid xs={3}>
            <StatsCard title="Since last block" value={latestBlockTs ? latestBlockTs.toNow() : "N/A"} />
          </Grid>
          <Grid xs={3}>
            <StatsCard title="Staked validators" value={valdatorCountQuery.data?.total_validators || "N/A"} />
          </Grid>
          <Grid xs={3}>
            <StatsCard title="Staked apps" value={4} />
          </Grid>
        </Grid.Container>
        <Grid.Container gap={2} >
          <Grid xs={8}>
            <Card>
              <ValidatorTable height={height} />
            </Card>
          </Grid>
          <Grid xs={4}>
            <NetworkInfoCard />
          </Grid>
        </Grid.Container>

      </Container>
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
