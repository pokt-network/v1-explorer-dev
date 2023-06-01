/**
 *
 * This is an example router for the Params model.
 */
import { router, publicProcedure } from '../trpc';
import { Prisma, val_type } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '~/server/prisma';

/**
 * Default selector for Params.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 */
const defaultParamsSelect = Prisma.validator<Prisma.paramsSelect>()({
  name: true,
  height: true,
  type: true,
  value: true,
});

export const paramsRouter = router({
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

      const items = await prisma.params.findMany({
        select: defaultParamsSelect,
        take: limit + 1,
        where: {},
        // cursor: cursor
        //   ? {
        //       name: cursor,
        //     }
        // : undefined,
        orderBy: {
          height: 'desc',
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop()!;
        nextCursor = nextItem.name;
      }

      return {
        items: items.reverse(),
        nextCursor,
      };
    }),
  byName: publicProcedure
    .input(
      z.object({
        name: z.string(),
        height: z.bigint(),
      }),
    )
    .query(async ({ input }) => {
      const { name, height } = input;
      const param = await prisma.params.findUnique({
        where: { name_height: { name, height } },
        select: defaultParamsSelect,
      });
      if (!param) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No parameter with name '${name}'`,
        });
      }
      return param;
    }),
  // add: publicProcedure
  //   .input(
  //     z.object({
  //       name: z.string(),
  //       height: z.bigint(),
  //       type: z.nativeEnum(val_type),
  //       value: z.string(),
  //     }),
  //   )
  //   .mutation(async ({ input }) => {
  //     const param = await prisma.params.create({
  //       data: input,
  //       select: defaultParamsSelect,
  //     });
  //     return param;
  //   }),
});
