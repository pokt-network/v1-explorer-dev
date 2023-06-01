/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ActorTypesEnum } from './ActorTypesEnum';

export type MessageEditStake = {
    actor_type: ActorTypesEnum;
    address: string;
    chains: Array<string>;
    service_url: string;
    signer: string;
    amount: string;
    denom: string;
};

