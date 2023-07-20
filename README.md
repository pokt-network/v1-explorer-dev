# Pocket v1 Developer Dashboard

## Overview
This is a utility application designed to aid developers in interacting with both local and development networks of Pocket v1. The app can function as a mini explorer, though currently it does not persist the historical data.

## Quick start

**Install dependencies:** This application uses `pnpm` for managing dependencies. If you don't have `pnpm`, install it first by running `npm install -g pnpm`. Then run the following command to install the application's dependencies:


```bash
pnpm install
```

**Configure your environment variables**: Make a copy of the `.env.example` file and rename it to `.env`. Then, open the `.env` file and update the environment variables as needed.

```bash
cp .env.example .env
edit .env
```

**Start the server**: Once you've set up your environment variables, you can start the server by running:
```bash
pnpm dx:next
```

## Network API

We currently expose a couple of API endpoints for interacting with DevNet infrastructure. Currently, we do not use any authentication for these endpoints.

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
The OpenAPI client is used to generate a client SDK from an OpenAPI Specification (OAS) document. In our case, we use it to generate a client SDK for interacting with the Pocket Network RPC API.

Here's how to generate or regenerate the OpenAPI client:

```bash
export POCKET_DIR=$HOME/pocket/pocket

# Run the openapi generator script
./node_modules/.bin/openapi --input $POCKET_DIR/rpc/v1/openapi.yaml --output ./src/utils/v1-rpc-client --name v1RPC
```
