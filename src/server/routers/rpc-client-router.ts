import { router, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { v1RPC, QueryValidatorsResponse } from '~/utils/v1-rpc-client';
import { env } from '../env';

const client = new v1RPC({
  BASE: env.POCKET_RPC_ENDPOINT,
});

export const rpcClientRouter = router({
  listValidators: publicProcedure
    .input(
      z.object({
        height: z.bigint(),
        page: z.number(),
        per_page: z.number().default(1000),
      }),
    )
    .query(async ({ input }) => {
      const { height, page, per_page } = input;
      return await client.query.postV1QueryValidators({
        height: Number(input.height),
        page,
        per_page,
      });
    }),
  height: publicProcedure.query(() => client.query.getV1QueryHeight()),
  queryBlock: publicProcedure
    .input(
      z.object({
        height: z.bigint(),
      }),
    )
    .query(async ({ input }) =>
      client.query.postV1QueryBlock({ height: Number(input.height) }),
    ),
});
