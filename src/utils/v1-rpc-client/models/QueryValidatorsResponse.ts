/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProtocolActor } from './ProtocolActor';

export type QueryValidatorsResponse = {
    validators: Array<ProtocolActor>;
    total_validators: number;
    page: number;
    total_pages: number;
};

