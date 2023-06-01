/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProtocolActor } from './ProtocolActor';

export type QueryAppsResponse = {
  apps: Array<ProtocolActor>;
  total_apps: number;
  page: number;
  total_pages: number;
};
