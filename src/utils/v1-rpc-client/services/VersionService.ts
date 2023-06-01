/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class VersionService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Get the current version of the Pocket Network API
     * @returns string Default response
     * @throws ApiError
     */
    public getV1Version(): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/v1/version',
        });
    }

}
