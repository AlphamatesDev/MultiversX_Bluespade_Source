import { createClient } from "./utils";
import { SUBGRAPH_URLS } from "config/subgraph";
import { SKALE } from "config/chains";

export const chainlinkClient = createClient(SUBGRAPH_URLS.common.chainLink);

export const skaleGraphClient = createClient(SUBGRAPH_URLS[SKALE].stats);
export const skaleReferralsGraphClient = createClient(SUBGRAPH_URLS[SKALE].referrals);
export const skaleGraphClientForTrades = createClient(SUBGRAPH_URLS[SKALE].trades);

export function getGmxGraphClient(chainId: number) {
  if (chainId === SKALE) {
    return skaleGraphClient;
  }

  throw new Error(`Unsupported chain ${chainId}`);
}

export function getGmxGraphClientByNewCreate(chainId: number) {
  if (chainId === SKALE) {
    return createClient(SUBGRAPH_URLS[SKALE].stats);
  }

  throw new Error(`Unsupported chain ${chainId}`);
}
