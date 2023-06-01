import Head from 'next/head';
import { ReactNode } from 'react';
import { Card, Text, CardProps, Link } from "@nextui-org/react";
import { trpc } from '~/utils/trpc';

type NetworkInfoCardProps = {} & Partial<CardProps>;

export const NetworkInfoCard = ({ ...cardProps }: NetworkInfoCardProps) => {
  const networkNameQuery = trpc.settings.useQuery();
  const networkName = networkNameQuery.data?.networkName;
  const links = {
    grafana: "",
    documentation: [""],
  };
  if (networkName === "LocalNet") {
    links.grafana = "http://localhost:42000/"
    links.documentation = ["https://github.com/pokt-network/pocket/blob/main/docs/development/README.md", "https://github.com/pokt-network/pocket/blob/main/build/localnet/README.md"]
  } else {
    links.grafana = "https://grafana.dev-us-east4-1.poktnodes.network:8443/"
    links.documentation = ["https://github.com/pokt-network/protocol-infra/blob/main/README.md", "https://www.notion.so/pocketnetwork/How-to-DevNet-ff1598f27efe44c09f34e2aa0051f0dd?pvs=4"]
  }

  // const linksNode =
  return (
    <Card {...cardProps}>
      <Card.Body>
        <Text size="$lg" b>Network info</Text>
        <Text>Grafana link: <Link href={links.grafana}>{links.grafana}</Link></Text>
        <Text b>Documentation: </Text>
        <Text></Text>
        {links.documentation.map((link) => <Link href={link} key={link}>{link}</Link>)}
      </Card.Body>
    </Card>
  );
};
