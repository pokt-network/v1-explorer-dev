/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChallengeRequest } from '../models/ChallengeRequest';
import type { ChallengeResponse } from '../models/ChallengeResponse';
import type { RawTXRequest } from '../models/RawTXRequest';
import type { RelayRequest } from '../models/RelayRequest';
import type { RelayResponse } from '../models/RelayResponse';
import type { Session } from '../models/Session';
import type { SessionRequest } from '../models/SessionRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ClientService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Broadcast raw transaction bytes
   * @param requestBody Raw transaction to be broadcasted
   * @returns any Transaction added to the mempool without errors
   * @throws ApiError
   */
  public postV1ClientBroadcastTxSync(
    requestBody: RawTXRequest,
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v1/client/broadcast_tx_sync',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
        500: `An error occurred while adding the transaction to the mempool`,
      },
    });
  }

  /**
   * Sends a session request to the network and get the nodes that will be servicing your requests for the session
   * @param requestBody Retrieve the list of actors involved in servicing and verifying a session
   * @returns Session Session response
   * @throws ApiError
   */
  public postV1ClientGetSession(
    requestBody: SessionRequest,
  ): CancelablePromise<Session> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v1/client/get_session',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
        500: `An error occurred while sending the session request to the network`,
      },
    });
  }

  /**
   * Sends a relay to the servicer to receive a response
   * @param requestBody Request a relay to be sent on behalf of your application
   * @returns RelayResponse Relay request response
   * @throws ApiError
   */
  public postV1ClientRelay(
    requestBody: RelayRequest,
  ): CancelablePromise<RelayResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v1/client/relay',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
        500: `An error occurred while sending the relay request to the network`,
      },
    });
  }

  /**
   * Sends a challenge request to the network
   * @param requestBody Request a challenge for invalid data returned from an RPC request
   * @returns ChallengeResponse Challenge request response
   * @throws ApiError
   */
  public postV1ClientChallenge(
    requestBody: ChallengeRequest,
  ): CancelablePromise<ChallengeResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v1/client/challenge',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
        500: `An error occurred while sending the challenge request to the network`,
      },
    });
  }
}
