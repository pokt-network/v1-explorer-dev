/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProtocolActor } from './ProtocolActor';

export type QueryFishermenResponse = {
    fishermen: Array<ProtocolActor>;
    total_fishermen: number;
    page: number;
    total_pages: number;
};

