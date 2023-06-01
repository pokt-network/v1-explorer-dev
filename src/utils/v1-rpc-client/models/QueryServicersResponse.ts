/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProtocolActor } from './ProtocolActor';

export type QueryServicersResponse = {
    servicers: Array<ProtocolActor>;
    total_servicers: number;
    page: number;
    total_pages: number;
};

