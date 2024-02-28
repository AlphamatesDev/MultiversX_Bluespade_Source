import { POLYGON, CRONOS, SKALE } from "./chains";

export const SUBGRAPH_URLS = {
  [POLYGON]: {
    stats: "https://api.thegraph.com/subgraphs/name/alphamatesdev/polygon-bluespade-stats",
    referrals: "https://api.thegraph.com/subgraphs/name/alphamatesdev/polygon-bluespade-referrals",
    trades:"https://api.thegraph.com/subgraphs/name/alphamatesdev/polygon-bluespade-trades",
  },
  
  [CRONOS]: {
    stats: "https://graph-node.bluespade.xyz/subgraphs/name/graphprotocol/stats",
    referrals: "https://graph-node.bluespade.xyz/subgraphs/name/graphprotocol/referrals",
    trades:"https://graph-node.bluespade.xyz/subgraphs/name/graphprotocol/trades",
  },

  [SKALE]: {
    stats: "https://skale-test-indexer.bluespade.xyz/subgraphs/name/graphprotocol/stats",
    referrals: "https://skale-test-indexer.bluespade.xyz/subgraphs/name/graphprotocol/referrals",
    trades:"https://skale-test-indexer.bluespade.xyz/subgraphs/name/graphprotocol/trades",
  },

  common: {
    chainLink: "https://api.thegraph.com/subgraphs/name/deividask/chainlink",
  },
};
