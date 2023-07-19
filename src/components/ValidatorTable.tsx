import { useAtomValue } from 'jotai';
import { trpc } from '../utils/trpc';

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/react';
import { latestBlockHeight } from '~/utils/appState';
import { Suspense, useState } from 'react';
import { ActorTypesEnum, ProtocolActor } from '~/utils/v1-rpc-client';
import { Card, CardBody } from '@nextui-org/react';
import { Tab, Tabs } from '@nextui-org/react';
import { ActorHeight } from '~/components/ActorHeight';

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function (): string {
  return this.toString();
};

const actorHeightForActor = (actor: ProtocolActor) => {
  if (actor.actor_type === ActorTypesEnum.APPLICATION) {
    return <>N/A</>;
  }
  return <ActorHeight serviceUrl={actor.service_url} />;
};

export const ValidatorTable = () => {
  const latestBHeight = useAtomValue(latestBlockHeight);
  const [currentActor, setCurrentActor] = useState<ActorTypesEnum>(
    ActorTypesEnum.VALIDATOR,
  );

  const isReadyToCall = !(latestBHeight === undefined);

  const listValidatorsQuery = trpc.rpc.listValidators.useQuery(
    {
      height: BigInt(isReadyToCall ? latestBHeight : 0),
      page: 1,
    },
    { enabled: isReadyToCall && currentActor === ActorTypesEnum.VALIDATOR },
  ); // Should be infiniteQuery & paginated

  const listServicersQuery = trpc.rpc.listServicers.useQuery(
    {
      height: BigInt(isReadyToCall ? latestBHeight : 0),
      page: 1,
    },
    { enabled: isReadyToCall && currentActor === ActorTypesEnum.SERVICER },
  );

  const listFishermenQuery = trpc.rpc.listFishermen.useQuery(
    {
      height: BigInt(isReadyToCall ? latestBHeight : 0),
      page: 1,
    },
    { enabled: isReadyToCall && currentActor === ActorTypesEnum.FISHERMAN },
  );

  const listApplicationsQuery = trpc.rpc.listApplications.useQuery(
    {
      height: BigInt(isReadyToCall ? latestBHeight : 0),
      page: 1,
    },
    { enabled: isReadyToCall && currentActor === ActorTypesEnum.APPLICATION },
  );
  const actors = [
    ...((currentActor === ActorTypesEnum.VALIDATOR &&
      listValidatorsQuery.data?.validators) ||
      []),
    ...((currentActor === ActorTypesEnum.SERVICER &&
      listServicersQuery.data?.servicers) ||
      []),
    ...((currentActor === ActorTypesEnum.FISHERMAN &&
      listFishermenQuery.data?.fishermen) ||
      []),
    ...((currentActor === ActorTypesEnum.APPLICATION &&
      listApplicationsQuery.data?.apps) ||
      []),
  ];

  const isLoading =
    listValidatorsQuery.isInitialLoading ||
    listValidatorsQuery.isRefetching ||
    listServicersQuery.isInitialLoading ||
    listServicersQuery.isRefetching ||
    listFishermenQuery.isInitialLoading ||
    listFishermenQuery.isRefetching ||
    listApplicationsQuery.isInitialLoading ||
    listApplicationsQuery.isRefetching;

  const columns = [
    { key: 'height', label: 'Height' },
    {
      key: 'address',
      label: 'Address',
    },
    {
      key: 'staked_amount',
      label: 'Staked Tokens',
    },
    {
      key: 'service_url',
      label: 'Service URL',
    },
    {
      key: 'paused_height',
      label: 'Paused height',
    },
    {
      key: 'chains',
      label: 'Chains',
    },
  ];

  if (!isReadyToCall) {
    return <p>Waiting for block information..</p>;
  }

  const content = (
    <>
      <Card>
        <CardBody>
          {isLoading ? (
            <p>Waiting for a response from RPC node</p>
          ) : (
            <Table
              removeWrapper
              aria-label="Validator list"
              // css={{
              //   height: 'auto',
              //   minWidth: '100%',
              // }}
              // shadow={false}
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn key={column.key}>{column.label}</TableColumn>
                )}
              </TableHeader>
              <TableBody items={actors}>
                {(item) => (
                  <TableRow key={item.address}>
                    <TableCell>
                      <Suspense>{actorHeightForActor(item)}</Suspense>
                    </TableCell>
                    <TableCell>{item.address}</TableCell>
                    <TableCell>{item.staked_amount}</TableCell>
                    <TableCell>{item.service_url}</TableCell>
                    <TableCell>{item.paused_height}</TableCell>
                    <TableCell>{item.chains}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </>
  );

  return (
    <>
      <div className="flex w-full flex-col">
        <Tabs
          aria-label="Actors"
          selectedKey={currentActor}
          onSelectionChange={(actor: any) => setCurrentActor(actor)}
          disabledKeys={['portal']}
        >
          <Tab key={ActorTypesEnum.VALIDATOR} title="Validators">
            {content}
          </Tab>
          <Tab key={ActorTypesEnum.SERVICER} title="Servicers">
            {content}
          </Tab>
          <Tab key={ActorTypesEnum.FISHERMAN} title="Fishermen">
            {content}
          </Tab>
          <Tab key={ActorTypesEnum.APPLICATION} title="Applications">
            {content}
          </Tab>
          <Tab key={'portal'} title="Portals">
            {content}
          </Tab>
        </Tabs>
      </div>
    </>
  );
};
