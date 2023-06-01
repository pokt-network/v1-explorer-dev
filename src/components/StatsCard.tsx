import Head from 'next/head';
import { ReactNode } from 'react';
import { Card, Text, CardProps } from "@nextui-org/react";


type StatsCardProps = { title: ReactNode, value: number | BigInt | string } & Partial<CardProps>;

export const StatsCard = ({ title, value, ...cardProps }: StatsCardProps) => {
  return (
    <Card {...cardProps}>
      <Card.Body>
        <Text size="$md">{title}</Text>
        <Text size="$lg" b>{value.toString()}</Text>
      </Card.Body>
    </Card>
  );
};
