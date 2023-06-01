/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ActorTypesEnum } from './ActorTypesEnum';

export type MessageUnpause = {
  actor_type: ActorTypesEnum;
  address: string;
  signer: string;
};
