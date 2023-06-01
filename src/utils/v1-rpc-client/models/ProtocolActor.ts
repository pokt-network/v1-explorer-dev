/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ActorTypesEnum } from './ActorTypesEnum';

export type ProtocolActor = {
  address: string;
  actor_type: ActorTypesEnum;
  public_key: string;
  chains: Array<string>;
  service_url: string;
  staked_amount: string;
  paused_height: number;
  unstaking_height: number;
  output_addr: string;
};
