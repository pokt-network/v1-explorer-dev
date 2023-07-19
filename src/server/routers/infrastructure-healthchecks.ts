import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { v1RPC } from '~/utils/v1-rpc-client';

export const infrastructureHealthchecksRouter = router({
  queryHeight: publicProcedure
    .input(
      z.object({
        serviceUrl: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { serviceUrl } = input;

      // ServiceURL currently exposes a p2p port.
      const rpcEndpoint = serviceUrl.replace('42069', '50832');
      const client = new v1RPC({
        BASE: 'http://' + rpcEndpoint,
      });

      return client.query.getV1QueryHeight();
    }),
});
