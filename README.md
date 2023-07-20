# Pocket v1 Developer Dashboard

## Overview

This is a utility application designed to aid developers in interacting with both local and development networks of
Pocket v1. The app can function as a mini explorer, though currently it does not persist the historical data.

## Quick start

**Install dependencies:** This application uses `pnpm` for managing dependencies. If you don't have `pnpm`, install it
first by running `npm install -g pnpm`. Then run the following command to install the application's dependencies:

```bash
pnpm install
```

**Configure your environment variables**: Make a copy of the `.env.example` file and rename it to `.env`. Then, open
the `.env` file and update the environment variables as needed.

```bash
cp .env.example .env
edit .env
```

**Start the server**: Once you've set up your environment variables, you can start the server by running:

```bash
pnpm dx:next
```

## Network API

We currently expose a couple of API endpoints for interacting with DevNet infrastructure. Currently, we do not use any
authentication for these endpoints.

### Read DevNet actor numbers

```
curl $(ENDPOINT)/api/network-parameters/read
```

returns

```
{
  "validators": {
    "count": 4
  },
  "full_nodes": {
    "count": 1
  },
  "fishermen": {
    "count": 1
  },
  "servicers": {
    "count": 3
  }
}
```

### Update DevNet actor numbers

Example of updating the servicers:

```
curl --header 'Content-Type: application/json' --data '{"network-parameters":"{\"servicers\": {\"count\": 3}}"}' $(ENDPOINT)/api/network-parameters/write
```

One or more actors can be updated at once. This action returns the current configuration, including all actors.

## OpenAPI Client Generation

This project requires access to Pocket v1 RPC. Since Pocket v1 supplies OpenAPI spec, we generated a Javascript client
out of it. Whenever changes to the spec are made, the client needs to be regenerated. Here is an example of how to do
that:

```bash
export POCKET_DIR=$HOME/pocket/pocket

# Run the openapi generator script
./node_modules/.bin/openapi --input $POCKET_DIR/rpc/v1/openapi.yaml --output ./src/utils/v1-rpc-client --name v1RPC
```

## Project Structure

The techologies utilized:

1. [Next.js](https://nextjs.org/) with React for server-side rendering and routing;
2. [TRPC](https://trpc.io/) for client-server communication;
3. [NextUI](https://nextui.org/) for UI components (the new, v2 version, which is not yet released officially);
4. [TailwindCSS](https://tailwindcss.com/) for styling;
5. [Kubernetes Javascript client](https://github.com/kubernetes-client/javascript) for interacting with Kubernetes API;

### Directory tree

```bash
.
├── playwright # Where the tests should be :)
├── prisma # Database ORM. Currently this app does not persist any data in the database, but it's there for future use.
│   └── migrations # DB migrations.
├── public # Static assets
└── src # The main source code
    ├── components # React components
    ├── pages # Next.js pages
    │   └── api # API endpoints
    │       ├── network-parameters # Network API endpoints (see above)
    │       └── trpc # TRPC endpoints (for client-server communication)
    ├── server # Server-side code
    │   └── routers # Server-side TRPC routes
    ├── styles # TailwindCSS styles
    └── utils # Utility code
        └── v1-rpc-client # Pocket v1 RPC client generated from OpenAPI spec (see above)
```

### Client-server communication

This project uses TRPC for communication between the client and the server. It allows to safely expose server-side, and
to perform query validation and static type checks.

Server-side TRPC routes are defined in `src/server/routers`. Once the server-side code is defined, the client-side hooks
now can be utilized:

```
import { trpc } from '~/utils/trpc';
const heightQuery = trpc.rpc.height.useQuery(undefined, {
  refetchInterval: 3000,
});
const height = heightQuery.data?.height; // Current block height
```

### UI components

This project uses NextUI v2 for UI components. Please refer to the [documentation](https://nextui-docs-v2.vercel.app/)
to discover available components.

This UI framework uses TailwindCSS under the hood. Please refer to the [documentation](https://tailwindcss.com/docs) if
you need to customize the styles.

## Deployment

Currently, the Dashboard is deployed to all Developer Networks of Pocket V1. An example of the deployment can be
found [here](https://github.com/pokt-network/protocol-infra/blob/f8ee685d6cb6f76a4232ac710844e9784f003953/charts/v1-network-base/templates/v1-explorer-dev.yaml).
The container image is built by CI, and pushed to
the [registry](https://github.com/pokt-network/v1-explorer-dev/pkgs/container/v1-explorer-dev/111026968?tag=main). 