/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BlockHeader } from './BlockHeader';
import type { IndexedTransaction } from './IndexedTransaction';

export type Block = {
  block_header: BlockHeader;
  transactions: Array<IndexedTransaction>;
};
