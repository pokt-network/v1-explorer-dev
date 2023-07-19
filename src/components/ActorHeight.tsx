'use client';
import { Tooltip } from '@nextui-org/react';
import { trpc } from '~/utils/trpc';

type ActorHeightProps = {
  serviceUrl: string;
};

export const ActorHeight = ({ serviceUrl }: ActorHeightProps) => {
  const actorHeightQuery = trpc.infrastructureHealthchecks.queryHeight.useQuery(
    {
      serviceUrl,
    },
    { refetchInterval: 5000 },
  );

  // If actor query is in error, return error message
  if (actorHeightQuery.error) {
    return <Tooltip content={actorHeightQuery.error.message}>ERR</Tooltip>;
  }

  const height = actorHeightQuery.data?.height;

  if (height === undefined) {
    return <>LOAD</>;
  }

  return <>{height}</>;
};
