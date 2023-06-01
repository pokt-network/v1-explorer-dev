/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';

import { ClientService } from './services/ClientService';
import { ConsensusService } from './services/ConsensusService';
import { HealthService } from './services/HealthService';
import { P2PService } from './services/P2PService';
import { QueryService } from './services/QueryService';
import { VersionService } from './services/VersionService';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class v1RPC {

    public readonly client: ClientService;
    public readonly consensus: ConsensusService;
    public readonly health: HealthService;
    public readonly p2P: P2PService;
    public readonly query: QueryService;
    public readonly version: VersionService;

    public readonly request: BaseHttpRequest;

    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? 'http://localhost:50832',
            VERSION: config?.VERSION ?? '1.0.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });

        this.client = new ClientService(this.request);
        this.consensus = new ConsensusService(this.request);
        this.health = new HealthService(this.request);
        this.p2P = new P2PService(this.request);
        this.query = new QueryService(this.request);
        this.version = new VersionService(this.request);
    }
}

