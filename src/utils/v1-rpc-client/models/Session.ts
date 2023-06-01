/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProtocolActor } from './ProtocolActor';

export type Session = {
    session_id: string;
    session_number: number;
    session_height: number;
    num_session_blocks: number;
    chain: string;
    geozone: string;
    application: ProtocolActor;
    servicers: Array<ProtocolActor>;
    fishermen: Array<ProtocolActor>;
};

