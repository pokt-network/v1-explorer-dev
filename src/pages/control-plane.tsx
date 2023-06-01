import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import {
  Grid,
  Container,
  Table,
  Card,
  Button,
  Link,
  Text,
} from '@nextui-org/react';
import { StatsCard } from '~/components/StatsCard';

import { allowedCommands } from '../utils/publicRuntimeConfig';
import { useState } from 'react';
import dayjs from 'dayjs';

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
      console.log(data);
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
      <Button
        key={commandName}
        onClick={async () => {
          const response = await executeCommand.mutateAsync({ commandName });
          console.log(response);
        }}
      >
        {commandName}
      </Button>
    );
  });

  return (
    <>
      <Container>
        <Grid.Container gap={2} justify="center">
          <Button.Group
            // color="gradient"
            ghost
            auto
            size="sm"
            disabled={executeCommand.isLoading}
          >
            {buttons}
          </Button.Group>
        </Grid.Container>

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
      </Container>
    </>
  );
};

export default ChainControlPage;
