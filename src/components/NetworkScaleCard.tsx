// import Head from 'next/head';
// import { ReactNode } from 'react';
import { Button, Card, Input, CardHeader, CardBody } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { trpc } from '~/utils/trpc';

// type NetworkScaleCardProps = {
//   title: ReactNode;
//   value: number | bigint | string;
// } & Partial<CardProps>;

export const NetworkScaleCard = () => {
  const [state, setState] = useState({
    validators: '0',
    servicers: '0',
    fishermen: '0',
    full_nodes: '0',
  });

  const currentActorCountsQuery = trpc.chainCommands.getCurrentScale.useQuery(
    undefined,
    {
      refetchInterval: 5000,
    },
  );

  const newActorCountsMutation = trpc.chainCommands.scaleActors.useMutation();

  // Update state only when the actual data changes, not when a new object is created
  useEffect(() => {
    const data =
      currentActorCountsQuery?.data && JSON.parse(currentActorCountsQuery.data);
    if (data) {
      const {
        validators: { count: validatorsCount = 0 } = {},
        servicers: { count: servicersCount = 0 } = {},
        fishermen: { count: fishermenCount = 0 } = {},
        full_nodes: { count: fullNodesCount = 0 } = {},
      } = data;
      setState((prevState) => {
        if (
          prevState.validators !== validatorsCount ||
          prevState.servicers !== servicersCount ||
          prevState.fishermen !== fishermenCount ||
          prevState.full_nodes !== fullNodesCount
        ) {
          return {
            validators: validatorsCount,
            servicers: servicersCount,
            fishermen: fishermenCount,
            full_nodes: fullNodesCount,
          };
        }
        return prevState;
      });
    }
  }, [currentActorCountsQuery.data]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setState((oldState) => ({ ...oldState, [name]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Create a new object with the right structure
    const formattedState = {
      validators: { count: Number(state.validators) },
      servicers: { count: Number(state.servicers) },
      fishermen: { count: Number(state.fishermen) },
      full_nodes: { count: Number(state.full_nodes) },
    };

    newActorCountsMutation.mutate(formattedState);
  };

  return (
    <Card>
      <CardHeader>
        <h3>Network actors scaling</h3>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4 p-1">
            <Input
              labelPlacement={'outside'}
              type="number"
              name="validators"
              label="Validators"
              value={state.validators}
              onChange={handleChange}
            />
            <Input
              labelPlacement={'outside'}
              type="number"
              name="servicers"
              label="Servicers"
              value={state.servicers}
              onChange={handleChange}
            />
            <Input
              labelPlacement={'outside'}
              type="number"
              name="fishermen"
              label="Fishermen"
              value={state.fishermen}
              onChange={handleChange}
            />
            <Input
              labelPlacement={'outside'}
              type="number"
              name="full_nodes"
              label="Full nodes"
              value={state.full_nodes}
              onChange={handleChange}
            />
            <Button type="submit">Apply</Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
