/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Transaction } from './Transaction';

export type IndexedTransaction = {
    height: number;
    index: number;
    result_code: number;
    signer_addr: string;
    recipient_addr: string;
    message_type: string;
    tx: Transaction;
};

