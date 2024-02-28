import { ethers } from "ethers";
import { sample } from "lodash";
// import { isDevelopment } from "lib/legacy";

const { parseEther } = ethers.utils;

export const POLYGON = 137;
export const CRONOS = 25;
export const SKALE = 1444673419;

// TODO take it from web3
export const DEFAULT_CHAIN_ID = SKALE;
export const CHAIN_ID = DEFAULT_CHAIN_ID;

export const SUPPORTED_CHAIN_IDS = [/*CRONOS, POLYGON, */SKALE];

export const IS_NETWORK_DISABLED = {
  [POLYGON]: true,
  [CRONOS]: true,
  [SKALE]: false
};

export const CHAIN_NAMES_MAP = {
  [POLYGON]: "Polygon",
  [CRONOS]: "Cronos",
  [SKALE]: "Skale"
};

export const GAS_PRICE_ADJUSTMENT_MAP = {
  [POLYGON]: "30000000000", // 30 gwei
  [CRONOS]: "3000000000", // 3 gwei
  [SKALE]: "100000", // 100 kwei
};

export const MAX_GAS_PRICE_MAP = {
  [POLYGON]: "200000000000", // 200 gwei
  [CRONOS]: "5000000000000", // 5000 gwei
  [SKALE]: "500000", // 500 kwei
};

export const HIGH_EXECUTION_FEES_MAP = {
  [POLYGON]: 3, // 3 USD
  [CRONOS]: 3, // 3 USD
  [SKALE]: 3, // 3 USD
};

const constants = {
  [POLYGON]: {
    nativeTokenSymbol: "MATIC",
    wrappedTokenSymbol: "WMATIC",
    defaultCollateralSymbol: "USDC",
    defaultFlagOrdersEnabled: true,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther("0.01"),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.01"),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.0100001"),
  },

  [CRONOS]: {
    nativeTokenSymbol: "CRO",
    wrappedTokenSymbol: "WCRO",
    defaultCollateralSymbol: "USDC",
    defaultFlagOrdersEnabled: true,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther("0.01"),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.01"),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.0100001"),
  },

  [SKALE]: {
    nativeTokenSymbol: "USDT", //"SKL",
    wrappedTokenSymbol: "USDT", //"SKL",
    defaultCollateralSymbol: "USDT",
    defaultFlagOrdersEnabled: true,
    positionReaderPropsLength: 11,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther("0.00000001"),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.00000001"),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.00000001"),
  },
};

const ALCHEMY_WHITELISTED_DOMAINS = ["gmx.io", "app.gmx.io"];

export const POLYGON_RPC_PROVIDERS = ["https://polygon-bor.publicnode.com"]; // Polygon Network
export const CRONOS_RPC_PROVIDERS = ["https://cronos.blockpi.network/v1/rpc/public"]; //Cronos MAINNET
export const SKALE_RPC_PROVIDERS = ["https://testnet.skalenodes.com/v1/juicy-low-small-testnet"]; //Europa Skale TESTNET
// BSC TESTNET
// const RPC_PROVIDERS = [
//   "https://data-seed-prebsc-1-s1.binance.org:8545",
//   "https://data-seed-prebsc-2-s1.binance.org:8545",
//   "https://data-seed-prebsc-1-s2.binance.org:8545",
//   "https://data-seed-prebsc-2-s2.binance.org:8545",
//   "https://data-seed-prebsc-1-s3.binance.org:8545",
//   "https://data-seed-prebsc-2-s3.binance.org:8545"
// ]

export const BSC_RPC_PROVIDERS = [
  "https://bsc-dataseed.binance.org",
  "https://bsc-dataseed1.defibit.io",
  "https://bsc-dataseed1.ninicoin.io",
  "https://bsc-dataseed2.defibit.io",
  "https://bsc-dataseed3.defibit.io",
  "https://bsc-dataseed4.defibit.io",
  "https://bsc-dataseed2.ninicoin.io",
  "https://bsc-dataseed3.ninicoin.io",
  "https://bsc-dataseed4.ninicoin.io",
  "https://bsc-dataseed1.binance.org",
  "https://bsc-dataseed2.binance.org",
  "https://bsc-dataseed3.binance.org",
  "https://bsc-dataseed4.binance.org",
];

export const RPC_PROVIDERS = {
  [POLYGON]: POLYGON_RPC_PROVIDERS,
  [CRONOS]: CRONOS_RPC_PROVIDERS,
  [SKALE]: SKALE_RPC_PROVIDERS,
};

export const FALLBACK_PROVIDERS = {
  [POLYGON]: ["https://polygon.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
  [CRONOS]: ["https://cronos.blockpi.network/v1/rpc/public"],
  [SKALE]: ["https://testnet.skalenodes.com/v1/juicy-low-small-testnet"],
};

export const NETWORK_METADATA = {
  [POLYGON]: {
    chainId: "0x" + POLYGON.toString(16),
    chainName: "Polygon",
    nativeCurrency: {
      name: "polygonEth",
      symbol: "polygonEth",
      decimals: 18,
    },
    rpcUrls: POLYGON_RPC_PROVIDERS,
    blockExplorerUrls: [getExplorerUrl(POLYGON)],
  },
  [CRONOS]: {
    chainId: "0x" + CRONOS.toString(16),
    chainName: "Cronos",
    nativeCurrency: {
      name: "CRO",
      symbol: "CRO",
      decimals: 18,
    },
    rpcUrls: CRONOS_RPC_PROVIDERS,
    blockExplorerUrls: [getExplorerUrl(CRONOS)],
  },
  [SKALE]: {
    chainId: "0x" + SKALE.toString(16),
    chainName: "Skale",
    nativeCurrency: {
      name: "SKL",
      symbol: "SKL",
      decimals: 18,
    },
    rpcUrls: SKALE_RPC_PROVIDERS,
    blockExplorerUrls: [getExplorerUrl(SKALE)],
  },
};

export const getConstant = (chainId: number, key: string) => {
  if (!constants[chainId]) {
    throw new Error(`Unsupported chainId ${chainId}`);
  }

  if (!(key in constants[chainId])) {
    throw new Error(`Key ${key} does not exist for chainId ${chainId}`);
  }

  return constants[chainId][key];
};

export function getChainName(chainId: number) {
  return CHAIN_NAMES_MAP[chainId];
}

export function getDefaultArbitrumRpcUrl() {
  return "https://arb-mainnet.g.alchemy.com/v2/ha7CFsr1bx5ZItuR6VZBbhKozcKDY4LZ";
}

export function getRpcUrl(chainId: number): string | undefined {
  return sample(RPC_PROVIDERS[chainId]);
}

export function getAlchemyHttpUrl() {
  if (ALCHEMY_WHITELISTED_DOMAINS.includes(window.location.host)) {
    return "https://arb-mainnet.g.alchemy.com/v2/ha7CFsr1bx5ZItuR6VZBbhKozcKDY4LZ";
  }
  return "https://arb-mainnet.g.alchemy.com/v2/EmVYwUw0N2tXOuG0SZfe5Z04rzBsCbr2";
}

export function getAlchemyWsUrl() {
  if (ALCHEMY_WHITELISTED_DOMAINS.includes(window.location.host)) {
    return "wss://arb-mainnet.g.alchemy.com/v2/ha7CFsr1bx5ZItuR6VZBbhKozcKDY4LZ";
  }
  return "wss://arb-mainnet.g.alchemy.com/v2/EmVYwUw0N2tXOuG0SZfe5Z04rzBsCbr2";
}

export function getExplorerUrl(chainId) {
  if (chainId === 3) {
    return "https://ropsten.etherscan.io/";
  } else if (chainId === 42) {
    return "https://kovan.etherscan.io/";
  } else if (chainId === POLYGON) {
    return "https://polygonscan.com/";
  } else if (chainId === CRONOS) {
    return "https://cronoscan.com/";
  } else if (chainId === SKALE) {
    return "https://juicy-low-small-testnet.explorer.testnet.skalenodes.com/";
  }
  return "https://etherscan.io/";
}

export function getHighExecutionFee(chainId) {
  return HIGH_EXECUTION_FEES_MAP[chainId] || 3;
}

export function isSupportedChain(chainId) {
  return SUPPORTED_CHAIN_IDS.includes(chainId);
}
