/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TxMessage } from './TxMessage';

export type Transaction = {
    hash: string;
    height: number;
    index: number;
    txMsg: TxMessage;
};

