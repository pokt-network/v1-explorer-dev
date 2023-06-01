/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Coin } from './Coin';
import type { Pool } from './Pool';

export type QuerySupplyResponse = {
  pools: Array<Pool>;
  total: Coin;
};
