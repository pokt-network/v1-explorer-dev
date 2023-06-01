/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ActorTypesEnum } from './ActorTypesEnum';

export type Actor = {
    type: ActorTypesEnum;
    address: string;
    public_key: string;
    service_url: string;
};

