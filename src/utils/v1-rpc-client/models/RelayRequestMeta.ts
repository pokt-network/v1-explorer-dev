/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AAT } from './AAT';
import type { Identifiable } from './Identifiable';

export type RelayRequestMeta = {
  block_height: number;
  servicer_pub_key: string;
  chain: Identifiable;
  geozone: Identifiable;
  token: AAT;
  signature: string;
};
