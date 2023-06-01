import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import { Grid, Container, Table, Card, Button, Link } from "@nextui-org/react";
import { StatsCard } from '~/components/StatsCard';

import { allowedCommands } from '../utils/publicRuntimeConfig';

const ChainControlPage: NextPageWithLayout = () => {

  const heightQuery = trpc.rpc.height.useQuery()
  const executeCommand = trpc.chainCommands.executeCommand.useMutation({
    onSuccess(data, variables, context) {
      console.log(data);
      heightQuery.refetch();
    },
  });

  const buttons = allowedCommands.map((commandName) => {
    return <Button key={commandName} onClick={
      async () => {
        const response = await executeCommand.mutateAsync({ commandName });
        console.log(response);
      }
    }>{commandName}</Button>
  });

  return (
    <>
      <Container>
        <Grid.Container gap={2} justify="center">
          <Button.Group color="gradient" ghost disabled={executeCommand.isLoading}>
            {buttons}
          </Button.Group>
        </Grid.Container>
      </Container>
    </>
  );
};

export default ChainControlPage;
