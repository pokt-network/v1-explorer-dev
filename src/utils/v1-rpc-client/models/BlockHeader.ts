/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QuorumCertificate } from './QuorumCertificate';

export type BlockHeader = {
  height: number;
  network_id: string;
  state_hash: string;
  prev_state_hash: string;
  proposer_addr: string;
  quorum_cert: QuorumCertificate;
  timestamp: string;
};
