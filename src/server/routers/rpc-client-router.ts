import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { v1RPC } from '~/utils/v1-rpc-client';
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
        height: Number(height),
        page,
        per_page,
      });
    }),

  listServicers: publicProcedure
    .input(
      z.object({
        height: z.bigint(),
        page: z.number(),
        per_page: z.number().default(1000),
      }),
    )
    .query(async ({ input }) => {
      const { height, page, per_page } = input;
      return await client.query.postV1QueryServicers({
        height: Number(height),
        page,
        per_page,
      });
    }),

  listFishermen: publicProcedure
    .input(
      z.object({
        height: z.bigint(),
        page: z.number(),
        per_page: z.number().default(1000),
      }),
    )
    .query(async ({ input }) => {
      const { height, page, per_page } = input;
      return await client.query.postV1QueryFishermen({
        height: Number(height),
        page,
        per_page,
      });
    }),

  listApplications: publicProcedure
    .input(
      z.object({
        height: z.bigint(),
        page: z.number(),
        per_page: z.number().default(1000),
      }),
    )
    .query(async ({ input }) => {
      const { height, page, per_page } = input;
      return await client.query.postV1QueryApps({
        height: Number(height),
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
