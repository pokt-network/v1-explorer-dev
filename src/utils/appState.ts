import { atom } from 'jotai';
import { Block, QueryBlockResponse } from './v1-rpc-client';

export type ExtendedQueryBlockResponse = (QueryBlockResponse & Block) | null;

export const latestBlocks = atom<ExtendedQueryBlockResponse[]>([]);
export const latestBlock = atom(
  (get) => get(latestBlocks)[get(latestBlocks).length - 1],
);
export const latestBlockHeight = atom(
  (get) => get(latestBlock)?.block_header.height,
);
export const latestHeight = atom<bigint>(BigInt(0));
