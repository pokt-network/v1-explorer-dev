/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ThresholdSignature } from './ThresholdSignature';

export type QuorumCertificate = {
    height: number;
    round: number;
    step: string;
    block: string;
    threshold_sig: ThresholdSignature;
    transactions: Array<string>;
};

