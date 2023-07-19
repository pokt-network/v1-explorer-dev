import { atom } from 'jotai';
import { Block, QueryBlockResponse } from './v1-rpc-client';

const BLOCKS_TO_PRESERVE = 3;

export type ExtendedQueryBlockResponse = (QueryBlockResponse & Block) | null;

export const latestBlocks = atom<ExtendedQueryBlockResponse[]>([]);
export const latestBlock = atom(
  (get) => get(latestBlocks)[get(latestBlocks).length - 1],
);
export const addBlock = atom(
  null,
  (get, set, newBlock: ExtendedQueryBlockResponse) => {
    set(latestBlocks, (prevBlocks) => {
      const newBlocks = [...prevBlocks, newBlock];
      if (newBlocks.length > BLOCKS_TO_PRESERVE) {
        // If more than BLOCKS_TO_PRESERVE blocks, remove the oldest one(s).
        return newBlocks.slice(-BLOCKS_TO_PRESERVE);
      } else {
        // TODO: populate with historical data.
        return newBlocks;
      }
    });
  },
);

export const latestBlockHeight = atom(
  (get) => get(latestBlock)?.block_header.height,
);

// export const latestBlockRewards = atom(
//   (get) => {
//     const lb = get(latestBlock)
//     lb?.transactions.forEach((tx) => {
//       // Look for proofs/claims in tx.tx.txMsg.message
//     })
//     return get(latestBlock)?.block_header.height;
//   },
// );

export const latestHeight = atom<bigint>(BigInt(0));

// export const listValidators = atom<ProtocolActor[]>([]);
// export const listServicers = atom<ProtocolActor[]>([]);
// export const listFishermen = atom<ProtocolActor[]>([]);
// export const listApps = atom<ProtocolActor[]>([]);
