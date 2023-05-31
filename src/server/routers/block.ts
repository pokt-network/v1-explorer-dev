/**
 *
 * This is an example router for the Block model.
 */
import { router, publicProcedure } from '../trpc';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '~/server/prisma';

/**
 * Default selector for Block.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 */
const defaultBlockSelect = Prisma.validator<Prisma.blockSelect>()({
  height: true,
  hash: true,
  proposer_address: true,
  quorum_certificate: true,
});

export const blockRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ input }) => {

      const limit = input.limit ?? 50;
      const { cursor } = input;

      const items = await prisma.block.findMany({
        select: defaultBlockSelect,
        take: limit + 1,
        where: {},
        cursor: cursor
          ? {
              height: BigInt(cursor),
            }
          : undefined,
        orderBy: {
          height: 'desc',
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop()!;
        nextCursor = nextItem.height.toString();
      }

      return {
        items: items.reverse(),
        nextCursor,
      };
    }),
  byHeight: publicProcedure
    .input(
      z.object({
        height: z.bigint(),
      }),
    )
    .query(async ({ input }) => {
      const { height } = input;
      const block = await prisma.block.findUnique({
        where: { height },
        select: defaultBlockSelect,
      });
      if (!block) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No block with height '${height}'`,
        });
      }
      return block;
    }),
  latest: publicProcedure
    .query(async () => {
      const block = await prisma.block.findFirst({
        select: defaultBlockSelect,
        orderBy: {
          height: 'desc',
        },
      });
      if (!block) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No block found`,
        });
      }
      return block;
    }),
});
