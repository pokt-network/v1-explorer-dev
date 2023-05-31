/**
 *
 * This is an example router for the Validator model.
 */
import { router, publicProcedure } from '../trpc';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '~/server/prisma';

/**
 * Default selector for Validator.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 */
const defaultValidatorSelect = Prisma.validator<Prisma.validatorSelect>()({
  address: true,
  public_key: true,
  staked_tokens: true,
  service_url: true,
  output_address: true,
  paused_height: true,
  unstaking_height: true,
  height: true,
});

export const validatorRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        height: z.bigint(),
      }),
    )
    .query(async ({ input }) => {

      const limit = input.limit ?? 50;
      const { cursor , height } = input;

      const items = await prisma.validator.findMany({
        select: defaultValidatorSelect,
        take: limit + 1,
        where: {
          height: {
            lte: height, // This translates to 'height <= [input.height]'
          },
        },
        cursor: cursor
          ? { address_height: { height, address: cursor }}
          : undefined,
        orderBy: [
          {
            address: 'asc', // This will make the SELECT DISTINCT ON (address) SQL clause
          },
          {
            height: 'desc', // This will make the ORDER BY address, height DESC SQL clause
          },
        ],
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop()!;
        nextCursor = nextItem.address;
      }

      return {
        items: items.reverse(),
        nextCursor,
      };
    }),
  count: publicProcedure.query(async () => {
      const count = await prisma.validator.count();
      return count;
  }),
  byAddress: publicProcedure
    .input(
      z.object({
        address: z.string(),
        height: z.bigint(),
      }),
    )
    .query(async ({ input }) => {
      const { address, height } = input;
      const validator = await prisma.validator.findUnique({
        where: { address_height: { address, height } },
        select: defaultValidatorSelect,
      });
      if (!validator) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No validator with address '${address}'`,
        });
      }
      return validator;
    }),
//   add: publicProcedure
//     .input(
//       z.object({
//         address: z.string(),
//         public_key: z.string(),
//         staked_tokens: z.string(),
//         service_url: z.string(),
//         output_address: z.string(),
//         paused_height: z.bigint().optional(),
//         unstaking_height: z.bigint().optional(),
//         height: z.bigint().optional(),
//       }),
//     )
//     .mutation(async ({ input }) => {
//       const validator = await prisma.validator.create({
//         data: input,
//         select: defaultValidatorSelect,
//       });
//       return validator;
//     }),
});
