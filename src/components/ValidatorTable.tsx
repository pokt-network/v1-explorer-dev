import { trpc } from '../utils/trpc';
import { Card, CardProps, Table } from "@nextui-org/react";

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function (): string {
  return this.toString();
};

type ValidatorTableProps = { height: bigint };

export const ValidatorTable = ({ height, ...cardProps }: ValidatorTableProps) => {
  const columns = [
    {
      key: "address",
      label: "Address",
    },
    {
      key: "staked_tokens",
      label: "Staked Tokens",
    },
    {
      key: "service_url",
      label: "Service URL",
    },
  ];

  const validatorListQuery = trpc.validator.list.useQuery({ limit: 100, height }); // Should be infinite & paginated

  return (
    <Table
      aria-label="Validator list"
      css={{
        height: "auto",
        minWidth: "100%",
      }}
    >
      <Table.Header columns={columns}>
        {(column) => (
          <Table.Column key={column.key}>{column.label}</Table.Column>
        )}
      </Table.Header>
      <Table.Body items={validatorListQuery.data?.items || []}>
        {(item) => (
          <Table.Row key={item.address + item.height}>
            <Table.Cell>{item.address}</Table.Cell>
            <Table.Cell>{item.staked_tokens}</Table.Cell>
            <Table.Cell>{item.service_url}</Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>

  );
};
