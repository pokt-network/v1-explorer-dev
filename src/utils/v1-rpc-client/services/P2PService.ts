/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActorTypesEnum } from '../models/ActorTypesEnum';
import type { P2PStakedActorsResponse } from '../models/P2PStakedActorsResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class P2PService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Returns the protocol actor address book
     * @param height The height the query will be executed on. By default it uses the current height of the consensus module. This may be the latest height if synched or an earlier height if synching.
     * @param actorType The type of actor the address book will be populated with. By default it returns an address book for all protocol actors supported by the blockchain
     * @returns P2PStakedActorsResponse Staked actors response
     * @throws ApiError
     */
    public getV1P2PStakedActorsAddressBook(
        height?: number,
        actorType?: ActorTypesEnum,
    ): CancelablePromise<P2PStakedActorsResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/v1/p2p/staked_actors_address_book',
            query: {
                'height': height,
                'actor_type': actorType,
            },
            errors: {
                400: `Bad request`,
                500: `An error occurred while retrieving the staked actors address book`,
            },
        });
    }

}
