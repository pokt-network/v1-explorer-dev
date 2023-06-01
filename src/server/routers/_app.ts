/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from '../trpc';
import { validatorRouter } from './validator';
import { blockRouter } from './block';
import { chainCommandsRouter } from './chain-commands';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),

  validator: validatorRouter,
  block: blockRouter,
  chainCommands: chainCommandsRouter,
});


export type AppRouter = typeof appRouter;
