import Head from 'next/head';
import { ReactNode } from 'react';
import { trpc } from '~/utils/trpc';
import { Card, CardBody, CardHeader, CardProps } from '@nextui-org/react';
import { Link } from '@nextui-org/react';

type NetworkInfoCardProps = Partial<CardProps>;

export const NetworkInfoCard = ({ ...cardProps }: NetworkInfoCardProps) => {
  const networkNameQuery = trpc.settings.useQuery();
  const networkName = networkNameQuery.data?.networkName;
  const links = {
    grafana: '',
    documentation: [''],
  };
  if (networkName === 'LocalNet') {
    links.grafana = 'http://localhost:42000/';
    links.documentation = [
      'https://github.com/pokt-network/pocket/blob/main/docs/development/README.md',
      'https://github.com/pokt-network/pocket/blob/main/build/localnet/README.md',
    ];
  } else {
    links.grafana = 'https://grafana.dev-us-east4-1.poktnodes.network:8443/';
    links.documentation = [
      'https://github.com/pokt-network/protocol-infra/blob/main/README.md',
      'https://www.notion.so/pocketnetwork/How-to-DevNet-ff1598f27efe44c09f34e2aa0051f0dd?pvs=4',
      'https://www.notion.so/pocketnetwork/V1-networks-7d95c10c930c45c3823c871f21d44fca?pvs=4',
    ];
  }

  // const linksNode =
  return (
    <Card {...cardProps}>
      <CardHeader>
        <h3>Network info</h3>
      </CardHeader>
      <CardBody>
        <p>
          Grafana link: <Link href={links.grafana}>{links.grafana}</Link>
        </p>
        <h3>Documentation: </h3>

        {links.documentation.map((link) => (
          <Link href={link} key={link}>
            {link}
          </Link>
        ))}
      </CardBody>
    </Card>
  );
};
