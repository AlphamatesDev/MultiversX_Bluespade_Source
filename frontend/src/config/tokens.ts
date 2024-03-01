import { getContract } from "./contracts";
import { SKALE } from "./chains";
import { Token } from "domain/tokens";

export const TOKENS: { [chainId: number]: Token[] } = {
  [SKALE]: [
    {
      name: "Bitcoin",
      symbol: "BTC",
      address: "0xcd070eb785c8fbfa5bb46aaafcb980e32884dcc8",
      decimals: 18,
      priceDecimals: 2,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/26115/thumb/btcb.png?1655921693",
    },
    {
      name: "Avax",
      symbol: "AVAX",
      address: "0xbdfbe351a98d06ad2976ab8761f964f7785bbf49",
      decimals: 18,
      priceDecimals: 4,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/26115/thumb/btcb.png?1655921693",
    },
    {
      name: "BNB",
      symbol: "BNB",
      address: "0xc1dec8035557de3b7b046dcf610fd9a440f9b44b",
      decimals: 18,
      priceDecimals: 2,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/26115/thumb/btcb.png?1655921693",
    },
    {
      name: "Ether",
      symbol: "ETH",
      address: "0x0ab782b6807fec13b0b2ede10389a470ee1b23e0",
      decimals: 18,
      priceDecimals: 2,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/26115/thumb/btcb.png?1655921693",
    },
    {
      name: "SOL",
      symbol: "SOL",
      address: "0xcb4f0a23401e878a8c2319d25bc001ec56a3cd5f",
      decimals: 18,
      priceDecimals: 2,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/26115/thumb/btcb.png?1655921693",
    },
    {
      name: "UNI",
      symbol: "UNI",
      address: "0x88ad159df68f08a0854c353178403b7a8471a1f3",
      decimals: 18,
      priceDecimals: 4,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/26115/thumb/btcb.png?1655921693",
    },
    {
      name: "Tether USD",
      symbol: "USDT",
      address: "0x1dfe87ce0509dedce83cd658d033b28ce6b1511f",
      decimals: 18,
      isStable: true,
      isCollateralToken: true,
      imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether.png?1668148663",
    },
  ],
};

export const ADDITIONAL_TOKENS: { [chainId: number]: Token[] } = {
  [SKALE]: [
    {
      name: "Bluespade",
      symbol: "BLU",
      address: getContract(SKALE, "GMX"),
      decimals: 18,
      imageUrl: "",
    },
    {
      name: "Escrowed BLU",
      symbol: "esBLU",
      address: getContract(SKALE, "ES_GMX"),
      decimals: 18,
    },
    {
      name: "BLU LP",
      symbol: "BLP",
      address: getContract(SKALE, "GLP"),
      decimals: 18,
      imageUrl: "",
    },
  ],
};

export const PLATFORM_TOKENS: { [chainId: number]: { [symbol: string]: Token } } = {
  [SKALE]: {
    // SKALE
    GMX: {
      name: "BLU",
      symbol: "BLU",
      decimals: 18,
      address: getContract(SKALE, "GMX"),
      imageUrl: "https://assets.coingecko.com/coins/images/18323/small/arbit.png?1631532468",
    },
    GLP: {
      name: "BLU LP",
      symbol: "BLP",
      decimals: 18,
      address: getContract(SKALE, "StakedGlpTracker"), // address of fsGLP token because user only holds fsGLP
      imageUrl: "https://github.com/BlueSpade-Dex/gmx-assets/blob/main/GMX-Assets/PNG/GLP_LOGO%20ONLY.png?raw=true",
    },
  },
};

export const ICONLINKS = {
  [SKALE]: {
    GMX: {
      skale: "https://juicy-low-small-testnet.explorer.testnet.skalenodes.com/address/0x7Ae4C9Be5053603c980b7101858e234594C77dB5",
    },
    GLP: {
      skale: "https://juicy-low-small-testnet.explorer.testnet.skalenodes.com/address/0xd9f0Fb5e6F82Da3206bFED10290a8390a0B54684",
    },
    BTC: {
      coingecko: "https://www.coingecko.com/en/coins/wrapped-bitcoin",
      skale: "https://juicy-low-small-testnet.explorer.testnet.skalenodes.com/address/0xcd070Eb785c8FBfA5Bb46aAafCb980E32884dCc8",
    },
    USDT: {
      coingecko: "https://www.coingecko.com/en/coins/tether",
      skale: "https://juicy-low-small-testnet.explorer.testnet.skalenodes.com/address/0x1dfe87ce0509dedce83cd658d033b28ce6b1511f",
    },
  },
};

export const GLP_POOL_COLORS = {
  CRO: "#AAAAFF",
  BTC: "#F7931A",
  WBTC: "#F7931A",
  ETH: "#6062a6",
  ATOM: "#FA44C0",
  ADA: "#AAFFAA",
  DOGE: "#1167FA",
  DAI: "#FAC044",
  USDT: "#67B18A",
  USDC: "#2775CA",

  MATIC: "#E84142",
  LINK: "#3256D6",
  AAVE: "#539dbb",
  BNB: "#8247e5",
  CRV: "#E9167C",
  FRAX: "#16E97C",
};

export const TOKENS_MAP: { [chainId: number]: { [address: string]: Token } } = {};
export const TOKENS_BY_SYMBOL_MAP: { [chainId: number]: { [symbol: string]: Token } } = {};
export const WRAPPED_TOKENS_MAP: { [chainId: number]: Token } = {};
export const NATIVE_TOKENS_MAP: { [chainId: number]: Token } = {};
export const COLLATERAL_TOKENS_MAP: { [chainId: number]: Token } = {};

const CHAIN_IDS = [SKALE];

for (let j = 0; j < CHAIN_IDS.length; j++) {
  const chainId = CHAIN_IDS[j];
  TOKENS_MAP[chainId] = {};
  TOKENS_BY_SYMBOL_MAP[chainId] = {};
  let tokens = TOKENS[chainId];
  if (ADDITIONAL_TOKENS[chainId]) {
    tokens = tokens.concat(ADDITIONAL_TOKENS[chainId]);
  }

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    TOKENS_MAP[chainId][token.address] = token;
    TOKENS_BY_SYMBOL_MAP[chainId][token.symbol] = token;
  }
}

for (const chainId of CHAIN_IDS) {
  for (const token of TOKENS[chainId]) {
    if (token.isCollateralToken) {
      COLLATERAL_TOKENS_MAP[chainId] = token;
    }
  }
}

export function getWrappedToken(chainId: number) {
  return WRAPPED_TOKENS_MAP[chainId];
}

export function getCollateralToken(chainId: number) {
  return COLLATERAL_TOKENS_MAP[chainId];
}

export function getNativeToken(chainId: number) {
  return NATIVE_TOKENS_MAP[chainId];
}

export function getTokens(chainId: number) {
  return TOKENS[chainId];
}

export function isValidToken(chainId: number, address: string) {
  if (!TOKENS_MAP[chainId]) {
    throw new Error(`Incorrect chainId ${chainId}`);
  }
  return address in TOKENS_MAP[chainId];
}

export function getToken(chainId: number, address: string) {
  address = address.toLowerCase();

  if (!TOKENS_MAP[chainId]) {
    throw new Error(`Incorrect chainId ${chainId}`);
  }
  if (!TOKENS_MAP[chainId][address]) {
    throw new Error(`Incorrect address "${address}" for chainId ${chainId}`);
  }
  return TOKENS_MAP[chainId][address];
}

export function getTokenBySymbol(chainId: number, symbol: string) {
  const token = TOKENS_BY_SYMBOL_MAP[chainId][symbol];
  if (!token) {
    throw new Error(`Incorrect symbol "${symbol}" for chainId ${chainId}`);
  }
  return token;
}

export function getWhitelistedTokens(chainId: number) {
  return TOKENS[chainId].filter((token) => token.symbol !== "USDG");
}

export function getVisibleTokens(chainId: number) {
  return getWhitelistedTokens(chainId).filter((token) => !token.isTempHidden);
}

export function isChartAvailabeForToken(chainId: number, tokenSymbol: string) {
  let token;

  try {
    token = getTokenBySymbol(chainId, tokenSymbol);
  } catch (e) {
    return false;
  }

  if (token.isChartDisabled || token.isPlatformToken) return false;

  return true;
}

export function getPriceDecimals(chainId: number, tokenSymbol?: string) {
  if (!tokenSymbol) return 2;

  try {
    const token = getTokenBySymbol(chainId, tokenSymbol);
    return token.priceDecimals ?? 2;
  } catch (e) {
    return 2;
  }
}