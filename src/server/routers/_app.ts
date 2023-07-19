/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from '../trpc';
import { chainCommandsRouter } from './chain-commands';
import { rpcClientRouter } from './rpc-client-router';
import { infrastructureHealthchecksRouter } from './infrastructure-healthchecks';

export const appRouter = router({
  infrastructureHealthchecks: infrastructureHealthchecksRouter,
  settings: publicProcedure.query(() => {
    return { networkName: process.env.NETWORK_NAME };
  }),

  chainCommands: chainCommandsRouter,
  rpc: rpcClientRouter,
});

export type AppRouter = typeof appRouter;
