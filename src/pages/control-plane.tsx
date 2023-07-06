import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import { Grid, Card, Button, Text } from '@nextui-org/react';

import { allowedCommands } from '../utils/publicRuntimeConfig';
import { useState } from 'react';
import dayjs from 'dayjs';
import { NetworkScaleCard } from '~/components/NetworkScaleCard';

type CommandHistoryItem = {
  command: string;
  status: string;
  stdout?: string;
  stderr?: string;
  timestamp: number;
  error?: string;
};

const ChainControlPage: NextPageWithLayout = () => {
  const heightQuery = trpc.rpc.height.useQuery();
  const executeCommand = trpc.chainCommands.executeCommand.useMutation({
    onSuccess(data, variables, context) {
      heightQuery.refetch();
      setCommandHistory((prev) => [
        {
          command: variables.commandName,
          status: 'success',
          stdout: data.stdout,
          stderr: data.stderr,
          timestamp: Date.now(),
        },
        ...prev,
      ]);
    },
    onError(error, variables, context) {
      setCommandHistory((prev) => [
        {
          command: variables.commandName,
          status: 'error',
          timestamp: Date.now(),
          error: error.message,
        },
        ...prev,
      ]);
    },
  });

  const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>(
    [],
  );

  const buttons = allowedCommands.map((commandName) => {
    return (
      <Grid key={commandName}>
        <Button
          onClick={async () => {
            const response = await executeCommand.mutateAsync({ commandName });
          }}
          size="sm"
          disabled={executeCommand.isLoading}
          ghost
        >
          {commandName}
        </Button>
      </Grid>
    );
  });

  return (
    <>
      <Grid.Container gap={2}>
        <Grid css={{ width: '100%' }}>
          <NetworkScaleCard />
        </Grid>
        <Grid css={{ width: '100%' }}>
          <Card>
            <Card.Header>
              <Text h3>Network commands</Text>
            </Card.Header>
            <Card.Body>
              <Text b css={{ my: '10px' }}>
                This functionality might not work on some networks, please use
                the `p1` CLI client instead if experiencing errors below.
              </Text>
              {/* <Button.Group
                  // color="gradient"
                  ghost
                  auto
                  size="sm"
                  disabled={executeCommand.isLoading}
                > */}

              {/* </Button.Group> */}
              <Grid.Container gap={2}>{buttons}</Grid.Container>

              <Grid.Container gap={2} justify="center">
                {commandHistory.map((item, index) => (
                  <Grid xs={12} key={index}>
                    <Card key={index}>
                      <Card.Header>
                        {item.status === 'success' ? '✅' : '❌'} {item.command}{' '}
                        {dayjs(item.timestamp).fromNow()}
                      </Card.Header>
                      <Card.Body>
                        <Text>{item.error}</Text>
                        <Text>{item.stdout}</Text>
                        <Text>{item.stderr}</Text>
                      </Card.Body>
                    </Card>
                  </Grid>
                ))}
              </Grid.Container>
            </Card.Body>
          </Card>
        </Grid>
      </Grid.Container>
    </>
  );
};

export default ChainControlPage;
