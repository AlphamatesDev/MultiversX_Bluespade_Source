import { SKALE } from "./chains";

export const SUBGRAPH_URLS = {
  [SKALE]: {
    stats: "https://skale-test-indexer.bluespade.xyz/subgraphs/name/graphprotocol/stats",
    referrals: "https://skale-test-indexer.bluespade.xyz/subgraphs/name/graphprotocol/referrals",
    trades:"https://skale-test-indexer.bluespade.xyz/subgraphs/name/graphprotocol/trades",
  },

  common: {
    chainLink: "https://api.thegraph.com/subgraphs/name/deividask/chainlink",
  },
};
