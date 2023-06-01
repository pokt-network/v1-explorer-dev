/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConsensusState } from '../models/ConsensusState';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ConsensusService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Gets the current height, round and step
   * @returns ConsensusState Default response
   * @throws ApiError
   */
  public getV1ConsensusState(): CancelablePromise<ConsensusState> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/v1/consensus/state',
    });
  }
}
