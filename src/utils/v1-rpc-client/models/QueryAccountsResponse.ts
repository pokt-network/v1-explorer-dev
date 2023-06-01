/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Account } from './Account';

export type QueryAccountsResponse = {
    result: Array<Account>;
    page: number;
    total_pages: number;
};

