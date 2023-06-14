import { atom, useAtom, useAtomValue } from 'jotai';
import { trpc } from '../utils/trpc';
import {
  Button,
  Card,
  CardProps,
  Table,
  Text,
  Loading,
} from '@nextui-org/react';
import { latestBlockHeight } from '~/utils/appState';
import { useState } from 'react';
import { ActorTypesEnum } from '~/utils/v1-rpc-client';

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function (): string {
  return this.toString();
};

export const ValidatorTable = ({ ...cardProps }) => {
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
  ];

  if (!isReadyToCall) {
    return <Loading>Waiting for block information..</Loading>;
  }

  return (
    <Card {...cardProps}>
      <Card.Header>
        <Button.Group size="sm">
          <Button
            onPress={() => setCurrentActor(ActorTypesEnum.VALIDATOR)}
            ghost={currentActor != ActorTypesEnum.VALIDATOR}
          >
            Validators
          </Button>
          <Button
            onPress={() => setCurrentActor(ActorTypesEnum.SERVICER)}
            ghost={currentActor != ActorTypesEnum.SERVICER}
          >
            Servicers
          </Button>
          <Button
            onPress={() => setCurrentActor(ActorTypesEnum.FISHERMAN)}
            ghost={currentActor != ActorTypesEnum.FISHERMAN}
          >
            Fishermen
          </Button>
          <Button
            onPress={() => setCurrentActor(ActorTypesEnum.APPLICATION)}
            ghost={currentActor != ActorTypesEnum.APPLICATION}
          >
            Applications
          </Button>
        </Button.Group>
      </Card.Header>
      <Card.Body>
        {isLoading ? (
          <Loading>Waiting for a response from RPC node</Loading>
        ) : (
          <Table
            aria-label="Validator list"
            css={{
              height: 'auto',
              minWidth: '100%',
            }}
            shadow={false}
          >
            <Table.Header columns={columns}>
              {(column) => (
                <Table.Column key={column.key}>{column.label}</Table.Column>
              )}
            </Table.Header>
            <Table.Body items={actors}>
              {(item) => (
                <Table.Row key={item.address}>
                  <Table.Cell>{item.address}</Table.Cell>
                  <Table.Cell>{item.staked_amount}</Table.Cell>
                  <Table.Cell>{item.service_url}</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};
