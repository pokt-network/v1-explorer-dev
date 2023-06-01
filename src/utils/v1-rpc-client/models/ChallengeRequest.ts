/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RelayResponse } from './RelayResponse';

export type ChallengeRequest = {
  majority_responses: Array<RelayResponse>;
  minority_response: RelayResponse;
  address: string;
  servicer_pub_key: string;
  session_id: string;
};
