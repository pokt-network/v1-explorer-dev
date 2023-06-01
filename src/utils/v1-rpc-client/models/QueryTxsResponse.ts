/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IndexedTransaction } from './IndexedTransaction';

export type QueryTxsResponse = {
  transactions: Array<IndexedTransaction>;
  total_txs: number;
  page: number;
  total_pages: number;
};
