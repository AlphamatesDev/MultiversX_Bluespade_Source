import { ethers } from "ethers";
import { sample } from "lodash";
// import { isDevelopment } from "lib/legacy";

const { parseEther } = ethers.utils;

export const SKALE = 1444673419;
export const MULTIVERSX = 10000;

// TODO take it from web3
export const DEFAULT_CHAIN_ID = SKALE;
export const CHAIN_ID = DEFAULT_CHAIN_ID;

export const SUPPORTED_CHAIN_IDS = [SKALE];

export const IS_NETWORK_DISABLED = {
  [SKALE]: false
};

export const CHAIN_NAMES_MAP = {
  [SKALE]: "Skale"
};

export const GAS_PRICE_ADJUSTMENT_MAP = {
  [SKALE]: "100000", // 100 kwei
};

export const MAX_GAS_PRICE_MAP = {
  [SKALE]: "500000", // 500 kwei
};

export const HIGH_EXECUTION_FEES_MAP = {
  [SKALE]: 3, // 3 USD
};

const constants = {
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

export const SKALE_RPC_PROVIDERS = ["https://testnet.skalenodes.com/v1/juicy-low-small-testnet"]; //Europa Skale TESTNET

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
  [SKALE]: SKALE_RPC_PROVIDERS,
};

export const FALLBACK_PROVIDERS = {
  [SKALE]: ["https://testnet.skalenodes.com/v1/juicy-low-small-testnet"],
};

export const NETWORK_METADATA = {
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
  } else if (chainId === SKALE) {
    return "https://juicy-low-small-testnet.explorer.testnet.skalenodes.com/";
  } else if (chainId === MULTIVERSX) {
    return "https://devnet-explorer.multiversx.com/";
  }
  return "https://etherscan.io/";
}

export function getHighExecutionFee(chainId) {
  return HIGH_EXECUTION_FEES_MAP[chainId] || 3;
}

export function isSupportedChain(chainId) {
  return SUPPORTED_CHAIN_IDS.includes(chainId);
}
