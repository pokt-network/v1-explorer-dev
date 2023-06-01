# Pocket v1 Blockchain Explorer / Dev Assistance App

## Overview
This is a utility application designed to aid developers in interacting with both local and development networks of Pocket v1. The app can function as a mini explorer.

## Quick start

Install dependencies:

```bash
pnpm install
```

Configure your environment variables:

```bash
cp .env.example .env
edit .env
```

Start the server:
```bash
pnpm dx:next
```

## OpenAPI Client Generation
The OpenAPI client is used to generate a client SDK from an OpenAPI Specification (OAS) document. In our case, we use it to generate a client SDK for interacting with the Pocket Network RPC API.

Here's how to generate or regenerate the OpenAPI client:

```bash
# Ensure you're in your project directory
cd /path/to/your/project

# Run the openapi generator script
./node_modules/.bin/openapi --input ~/pocket/pocket/rpc/v1/openapi.yaml --output ./src/utils/v1-rpc-client --name v1RPC
```
