/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Account } from '../models/Account';
import type { AllChainParamsResponse } from '../models/AllChainParamsResponse';
import type { IndexedTransaction } from '../models/IndexedTransaction';
import type { Parameter } from '../models/Parameter';
import type { ProtocolActor } from '../models/ProtocolActor';
import type { QueryAccountHeight } from '../models/QueryAccountHeight';
import type { QueryAccountPaginated } from '../models/QueryAccountPaginated';
import type { QueryAccountsResponse } from '../models/QueryAccountsResponse';
import type { QueryAccountTxsResponse } from '../models/QueryAccountTxsResponse';
import type { QueryAppsResponse } from '../models/QueryAppsResponse';
import type { QueryBalanceResponse } from '../models/QueryBalanceResponse';
import type { QueryBlockResponse } from '../models/QueryBlockResponse';
import type { QueryFishermenResponse } from '../models/QueryFishermenResponse';
import type { QueryHash } from '../models/QueryHash';
import type { QueryHeight } from '../models/QueryHeight';
import type { QueryHeightPaginated } from '../models/QueryHeightPaginated';
import type { QueryPaginated } from '../models/QueryPaginated';
import type { QueryParameter } from '../models/QueryParameter';
import type { QueryServicersResponse } from '../models/QueryServicersResponse';
import type { QuerySupplyResponse } from '../models/QuerySupplyResponse';
import type { QuerySupportedChainsResponse } from '../models/QuerySupportedChainsResponse';
import type { QueryTxsResponse } from '../models/QueryTxsResponse';
import type { QueryUpgradeResponse } from '../models/QueryUpgradeResponse';
import type { QueryValidatorsResponse } from '../models/QueryValidatorsResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class QueryService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Returns the data of the account specified at a given height
   * @param requestBody Request account data at the specified height, height = 0 is used as the latest
   * @returns Account Returns account data at the specified height
   * @throws ApiError
   */
  public postV1QueryAccount(
    requestBody: QueryAccountHeight,
  ): CancelablePromise<Account> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v1/query/account',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
        500: `An error occurred while retrieving the account data at the specified height`,
      },
    });
  }

  /**
   * Returns the paginated data of all accounts specified at a given height
   * @param requestBody Request all account data at the specified height, height = 0 is used as the latest; Max per_page=1000
   * @returns QueryAccountsResponse Returns account data for all accounts at the specified height
   * @throws ApiError
   */
  public postV1QueryAccounts(
    requestBody: QueryHeightPaginated,
  ): CancelablePromise<QueryAccountsResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v1/query/accounts',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
        500: `An error occurred while retrieving accounts at the specified height`,
      },
    });
  }

  /**
   * Returns all transactions sent by the specified address paginated
   * @param requestBody Returns all transactions sent by the address provided; Max per_page=1000, can be sorted either asc or desc (default)
   * @returns QueryAccountTxsResponse Returns the transaction list for the account
   * @throws ApiError
   */
  public postV1QueryAccountTxs(
    requestBody: QueryAccountPaginated,
  ): CancelablePromise<QueryAccountTxsResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v1/query/account_txs',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
        500: `An error occurred while retrieving the transactions for the account`,
      },
    });
  }

  /**
   * Returns the current values of all on-chain governance parameters
   * @returns AllChainParamsResponse Returns all the chain parameters
   * @throws ApiError
   */
  public getV1QueryAllChainParams(): CancelablePromise<AllChainParamsResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/v1/query/all_chain_params',
      errors: {
        500: `An error occurred while retrieving the current chain parameters`,
      },
    });
  }

  /**
   * Returns the data for the specific app address at a given height
   * @param requestBody Request application data at the specified height, height = 0 is used as the latest
   * @returns ProtocolActor Returns application data at the specified height
   * @throws ApiError
   */
  public postV1QueryApp(
    requestBody: QueryAccountHeight,
  ): CancelablePromise<ProtocolActor> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v1/query/app',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
        500: `An error occurred while retrieving the application data at the specified height`,
      },
    });
  }

  /**
   * Returns the data for the all apps at the specified height
   * @param requestBody Request all application data at the specified height, height = 0 is used as the latest; Max per_page=1000
   * @returns QueryAppsResponse Returns application data at the specified height
   * @throws ApiError
   */
  public postV1QueryApps(
    requestBody: QueryHeightPaginated,
  ): CancelablePromise<QueryAppsResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v1/query/apps',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
        500: `An error occurred while retrieving all application data at the specified height`,
      },
    });
  }

  /**
   * Returns the balance of the account at the specified height
   * @param requestBody Request account balance at the specified height, height = 0 is used as the latest
   * @returns QueryBalanceResponse Returns account balance at the specified height
   * @throws ApiError
   */
  public postV1QueryBalance(
    requestBody: QueryAccountHeight,
  ): CancelablePromise<QueryBalanceResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v1/query/balance',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
        500: `An error occurred while retrieving the account balance at the specified height`,
      },
    });
  }

  /**
   * Returns the block structure at the specified height
   * @param requestBody Request the block at the specified height, height = 0 is used as the latest
   * @returns QueryBlockResponse Returns block structure at the specified height
   * @throws ApiError
   */
  public postV1QueryBlock(
    requestBody: QueryHeight,
  ): CancelablePromise<QueryBlockResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v1/query/block',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
        500: `An error occurred while retrieving the block structure at the specified height`,
      },
    });
  }

  /**
   * Returns all the transactions in the block at the specified height
   * @param requestBody Request the transactions in the block at the specified height, height = 0 is used as the latest; Max per_page=1000, can be sorted either asc or desc (default)
   * @returns QueryTxsResponse Returns all transactions in the block at the specified height
   * @throws ApiError
   */
  public postV1QueryBlockTxs(
    requestBody: QueryHeightPaginated,
  ): CancelablePromise<QueryTxsResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v1/query/block_txs',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
        500: `An error occurred while retrieving the block transactions at the specified height`,
      },
    });
  }

  /**
   * Returns the data for the specific fisherman address at a given height
   * @param requestBody Request fisherman data at the specified height, height = 0 is used as the latest
   * @returns ProtocolActor Returns fisherman data at the specified height
   * @throws ApiError
   */
  public postV1QueryFisherman(
    requestBody: QueryAccountHeight,
  ): CancelablePromise<ProtocolActor> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v1/query/fisherman',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
        500: `An error occurred while retrieving the fisherman data at the specified height`,
      },
    });
  }

  /**
   * Returns the data for the all fishermen at the specified height
   * @param requestBody Request all fishermen data at the specified height, height = 0 is used as the latest; Max per_page=1000
   * @returns QueryFishermenResponse Returns all fishermen data at the specified height
   * @throws ApiError
   */
  public postV1QueryFishermen(
    requestBody: QueryHeightPaginated,
  ): CancelablePromise<QueryFishermenResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v1/query/fishermen',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
        500: `An error occurred while retrieving all fishermen data at the specified height`,
      },
    });
  }

  /**
   * Returns the current block height
   * @returns QueryHeight Returns the current height
   * @throws ApiError
   */
  public getV1QueryHeight(): CancelablePromise<QueryHeight> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/v1/query/height',
      errors: {
        500: `An error occurred while retrieving the current height`,
      },
    });
  }

  /**
   * @param requestBody Request the value of the specified chain parameter at the given height, height = 0 is used as the latest
   * @returns Parameter Returns the value of the parameter at the specified height
   * @throws ApiError
   */
  public postV1QueryParam(
    requestBody: QueryParameter,
  ): CancelablePromise<Parameter> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v1/query/param',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
        500: `An error occurred while retrieving the parameter`,
      },
    });
  }

  /**
   * Returns the data for the specific servicer address at a given height
   * @param requestBody Request servicer data at the specified height, height = 0 is used as the latest
   * @returns ProtocolActor Returns servicer data at the specified height
   * @throws ApiError
   */
  public postV1QueryServicer(
    requestBody: QueryAccountHeight,
  ): CancelablePromise<ProtocolActor> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v1/query/servicer',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
        500: `An error occurred while retrieving the servicer data at the specified height`,
      },
    });
  }

  /**
   * Returns the data for the all servicers at the specified height
   * @param requestBody Request all servicers data at the specified height, height = 0 is used as the latest; Max per_page=1000
   * @returns QueryServicersResponse Returns all servicers data at the specified height
   * @throws ApiError
   */
  public postV1QueryServicers(
    requestBody: QueryHeightPaginated,
  ): CancelablePromise<QueryServicersResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v1/query/servicers',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
        500: `An error occurred while retrieving all servicers data at the specified height`,
      },
    });
  }

  /**
   * Returns the token supply at the specified height
   * @param requestBody Request the token supply data at the specified height, height = 0 is used as the latest; Max per_page=1000
   * @returns QuerySupplyResponse Returns the token supply data at the specified height
   * @throws ApiError
   */
  public postV1QuerySupply(
    requestBody: QueryHeight,
  ): CancelablePromise<QuerySupplyResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v1/query/supply',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
        500: `An error occurred while retrieving the token supply data at the specified height`,
      },
    });
  }

  /**
   * Returns the supported chains at the specified height
   * @param requestBody Request the supported chains at the specified height, height = 0 is used as the latest; Max per_page=1000
   * @returns QuerySupportedChainsResponse Returns the supported chains list at the specified height
   * @throws ApiError
   */
  public postV1QuerySupportedChains(
    requestBody: QueryHeight,
  ): CancelablePromise<QuerySupportedChainsResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v1/query/supported_chains',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
        500: `An error occurred while retrieving the supported chains at the specified height`,
      },
    });
  }

  /**
   * Returns the transaction by its hash
   * @param requestBody Request a transaction from its hash
   * @returns IndexedTransaction Returns the transaction
   * @throws ApiError
   */
  public postV1QueryTx(
    requestBody: QueryHash,
  ): CancelablePromise<IndexedTransaction> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v1/query/tx',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
        500: `An error occurred while retrieving the transaction`,
      },
    });
  }

  /**
   * Returns the unconfirmed transaction by its hash from mempool
   * @param requestBody Request an unconfirmed transaction currently in the mempool from its hash
   * @returns IndexedTransaction Returns the unconfirmed transaction from the mempool
   * @throws ApiError
   */
  public postV1QueryUnconfirmedTx(
    requestBody: QueryHash,
  ): CancelablePromise<IndexedTransaction> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v1/query/unconfirmed_tx',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
        500: `An error occurred while retrieving the transaction from the mempool`,
      },
    });
  }

  /**
   * Returns all unconfirmed transactions handled by the mempool
   * @param requestBody Request the unconfirmed transactions currently in the mempool
   * @returns QueryTxsResponse Returns all the unconfirmed transactions in the mempool
   * @throws ApiError
   */
  public postV1QueryUnconfirmedTxs(
    requestBody: QueryPaginated,
  ): CancelablePromise<QueryTxsResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v1/query/unconfirmed_txs',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
        500: `An error occurred while retrieving the transactions in the mempool`,
      },
    });
  }

  /**
   * Returns the upgrade information for the specified height
   * @param requestBody Request the upgrade information for the specified height, height = 0 is used as latest
   * @returns QueryUpgradeResponse Returns the upgrade information for the specified height
   * @throws ApiError
   */
  public postV1QueryUpgrade(
    requestBody: QueryHeight,
  ): CancelablePromise<QueryUpgradeResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v1/query/upgrade',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
        500: `An error occurred while retrieving the update information`,
      },
    });
  }

  /**
   * Returns the data for the specific validator address at a given height
   * @param requestBody Request validator data at the specified height, height = 0 is used as the latest
   * @returns ProtocolActor Returns validator data at the specified height
   * @throws ApiError
   */
  public postV1QueryValidator(
    requestBody: QueryAccountHeight,
  ): CancelablePromise<ProtocolActor> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v1/query/validator',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
        500: `An error occurred while retrieving the validator data at the specified height`,
      },
    });
  }

  /**
   * Returns the data for the all validators at the specified height
   * @param requestBody Request all validators data at the specified height, height = 0 is used as the latest; Max per_page=1000
   * @returns QueryValidatorsResponse Returns all validators data at the specified height
   * @throws ApiError
   */
  public postV1QueryValidators(
    requestBody: QueryHeightPaginated,
  ): CancelablePromise<QueryValidatorsResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/v1/query/validators',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request`,
        500: `An error occurred while retrieving all validators data at the specified height`,
      },
    });
  }
}
