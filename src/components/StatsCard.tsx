import Head from 'next/head';
import { ReactNode } from 'react';
import { Card, CardBody, CardProps } from '@nextui-org/card';

type StatsCardProps = {
  title: ReactNode;
  value: number | bigint | string;
} & Partial<CardProps>;

export const StatsCard = ({ title, value, ...cardProps }: StatsCardProps) => {
  return (
    <Card {...cardProps}>
      <CardBody>
        <h5
          className={
            'text-medium text-small font-semibold leading-none text-default-600'
          }
        >
          {title}
        </h5>
        <h4 className={'text-large'}>{value.toString()}</h4>
      </CardBody>
    </Card>
  );
};
