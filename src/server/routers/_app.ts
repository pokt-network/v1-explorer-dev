/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from '../trpc';
import { validatorRouter } from './validator';
import { blockRouter } from './block';
import { chainCommandsRouter } from './chain-commands';
import { rpcClientRouter } from './rpc-client-router';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  settings: publicProcedure.query(() => { return { networkName: process.env.NETWORK_NAME } }),

  validator: validatorRouter,
  block: blockRouter,
  chainCommands: chainCommandsRouter,
  rpc: rpcClientRouter
});


export type AppRouter = typeof appRouter;
