import { trpc } from '../utils/trpc';
import { Card, CardProps, Table, Text } from '@nextui-org/react';

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function (): string {
  return this.toString();
};

type ValidatorTableProps = { height: bigint };

export const ValidatorTable = ({
  height,
  ...cardProps
}: ValidatorTableProps) => {
  const columns = [
    {
      key: 'address',
      label: 'Address',
    },
    {
      key: 'staked_tokens',
      label: 'Staked Tokens',
    },
    {
      key: 'service_url',
      label: 'Service URL',
    },
  ];

  const validatorListQuery = trpc.rpc.listValidators.useQuery({
    height: BigInt(height),
    page: 1,
  }); // Should be infiniteQuery & paginated

  return (
    <Card {...cardProps}>
      <Card.Header>
        <Text b>Staked actors</Text>
      </Card.Header>
      <Card.Body>
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
          <Table.Body items={validatorListQuery.data?.validators || []}>
            {(item) => (
              <Table.Row key={item.address + height}>
                <Table.Cell>{item.address}</Table.Cell>
                <Table.Cell>{item.staked_amount}</Table.Cell>
                <Table.Cell>{item.service_url}</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Card.Body>
    </Card>
  );
};
