/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Payload } from './Payload';
import type { RelayRequestMeta } from './RelayRequestMeta';

export type RelayRequest = {
    payload: Payload;
    meta: RelayRequestMeta;
};

