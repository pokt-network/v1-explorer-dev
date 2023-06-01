/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ActorTypesEnum } from './ActorTypesEnum';

export type MessageStake = {
    actor_type: ActorTypesEnum;
    public_key: string;
    chains: Array<string>;
    service_url: string;
    output_address: string;
    signer: string;
    amount: string;
    denom: string;
};

