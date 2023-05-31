import { ValidatorTable } from '~/components/ValidatorTable';
import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import { Grid, Container, Table, Card } from "@nextui-org/react";
import { StatsCard } from '~/components/StatsCard';


const IndexPage: NextPageWithLayout = () => {
  // const utils = trpc.useContext();
  const latestBlockQuery = trpc.block.latest.useQuery();
  const valdatorCountQuery = trpc.validator.count.useQuery();

  console.log(latestBlockQuery.data)

  return (
    <>
      <Container>
        <Grid.Container gap={2} justify="center">
          <Grid xs={3}>
            <StatsCard title="Latest block" value={latestBlockQuery.data?.height || 0} />
          </Grid>
          <Grid xs={3}>
            <StatsCard title="Since last block" value={1232132132} />
          </Grid>
          <Grid xs={3}>
            <StatsCard title="Staked validators" value={valdatorCountQuery.data || 0} />
          </Grid>
          <Grid xs={3}>
            <StatsCard title="Staked apps" value={4} />
          </Grid>
        </Grid.Container>
        <Grid.Container gap={2} >
          <Grid xs={8}>
            <Card>
              <ValidatorTable height={latestBlockQuery.data?.height || BigInt(0)} />
            </Card>
          </Grid>
          <Grid xs={4}>
            <StatsCard title="Latest block" value={latestBlockQuery.data?.height || 0} />
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
