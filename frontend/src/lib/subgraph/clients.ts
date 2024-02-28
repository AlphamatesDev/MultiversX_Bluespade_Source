import { createClient } from "./utils";
import { SUBGRAPH_URLS } from "config/subgraph";
import { CRONOS, POLYGON, SKALE } from "config/chains";

export const chainlinkClient = createClient(SUBGRAPH_URLS.common.chainLink);

export const cronosGraphClient = createClient(SUBGRAPH_URLS[CRONOS].stats);
export const cronosReferralsGraphClient = createClient(SUBGRAPH_URLS[CRONOS].referrals);
export const cronosGraphClientForTrades = createClient(SUBGRAPH_URLS[CRONOS].trades);

export const polygonGraphClient = createClient(SUBGRAPH_URLS[POLYGON].stats);
export const polygonReferralsGraphClient = createClient(SUBGRAPH_URLS[POLYGON].referrals);
export const polygonGraphClientForTrades = createClient(SUBGRAPH_URLS[POLYGON].trades);

export const skaleGraphClient = createClient(SUBGRAPH_URLS[SKALE].stats);
export const skaleReferralsGraphClient = createClient(SUBGRAPH_URLS[SKALE].referrals);
export const skaleGraphClientForTrades = createClient(SUBGRAPH_URLS[SKALE].trades);

export function getGmxGraphClient(chainId: number) {
  if (chainId === CRONOS) {
    return cronosGraphClient;
  } else if (chainId === POLYGON) {
    return polygonGraphClient;
  } else if (chainId === SKALE) {
    return skaleGraphClient;
  }

  throw new Error(`Unsupported chain ${chainId}`);
}

export function getGmxGraphClientByNewCreate(chainId: number) {
  if (chainId === CRONOS) {
    return createClient(SUBGRAPH_URLS[CRONOS].stats);
  } else if (chainId === POLYGON) {
    return createClient(SUBGRAPH_URLS[POLYGON].stats);
  } else if (chainId === SKALE) {
    return createClient(SUBGRAPH_URLS[SKALE].stats);
  }

  throw new Error(`Unsupported chain ${chainId}`);
}
