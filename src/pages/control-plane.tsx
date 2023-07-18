'use client';
import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';

import { allowedCommands } from '../utils/publicRuntimeConfig';
import { useState } from 'react';
import dayjs from 'dayjs';
import { NetworkScaleCard } from '~/components/NetworkScaleCard';
import { Button } from '@nextui-org/react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';

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
      <Button
        key={commandName}
        onPress={async () => {
          const response = await executeCommand.mutateAsync({ commandName });
        }}
        size="sm"
        disabled={executeCommand.isLoading}
      >
        {commandName}
      </Button>
    );
  });

  return (
    <>
      <div className={'w-full'}>
        <NetworkScaleCard />
      </div>
      <div className={'w-full mt-5'}>
        <Card>
          <CardHeader>
            <h3>Network commands</h3>
          </CardHeader>
          <CardBody>
            <p className={'mb-5'}>
              This functionality might not work on some networks, please use the
              `p1` CLI client instead if experiencing errors below.
            </p>

            {/* </Button.Group> */}
            <div className="flex flex-wrap gap-4 items-center">{buttons}</div>

            <div className={'mt-3'}>
              {commandHistory.map((item, index) => (
                <div key={index}>
                  <Card key={index}>
                    <CardHeader>
                      {item.status === 'success' ? '✅' : '❌'} {item.command}{' '}
                      {dayjs(item.timestamp).fromNow()}
                    </CardHeader>
                    <CardBody>
                      <p>{item.error}</p>
                      <p>{item.stdout}</p>
                      <p>{item.stderr}</p>
                    </CardBody>
                  </Card>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default ChainControlPage;
