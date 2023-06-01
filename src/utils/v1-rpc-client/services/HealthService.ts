/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class HealthService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get the liveness of the Pocket API node
   * @returns any Healthy
   * @throws ApiError
   */
  public getV1Health(): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/v1/health',
      errors: {
        404: `Unhealthy - Unreachable`,
        500: `Unhealthy - Server Error`,
      },
    });
  }
}
