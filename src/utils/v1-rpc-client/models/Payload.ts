/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Headers } from './Headers';

export type Payload = {
  data: string;
  method: string;
  path: string;
  headers: Headers;
};
