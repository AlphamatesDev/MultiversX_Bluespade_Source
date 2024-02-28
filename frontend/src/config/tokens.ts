import { ethers } from "ethers";
import { getContract } from "./contracts";
import { POLYGON, CRONOS, SKALE } from "./chains";
import { Token } from "domain/tokens";

export const TOKENS: { [chainId: number]: Token[] } = {
  [POLYGON]: [
    {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
      address: ethers.constants.AddressZero,
      isNative: true,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912",
    },
    {
      name: "Wrapped Matic",
      symbol: "WMATIC",
      decimals: 18,
      address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
      isWrapped: true,
      baseSymbol: "MATIC",
      imageUrl: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912",
    },
    {
      name: "Bitcoin",
      symbol: "BTC",
      address: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
      decimals: 8,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/26115/thumb/btcb.png?1655921693",
    },
    {
      name: "Ether",
      symbol: "ETH",
      address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
      decimals: 18,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/2518/thumb/weth.png?1628852295",
    },
    {
      name: "Link",
      symbol: "LINK",
      address: "0xb0897686c545045afc77cf20ec7a532e3120e0f1",
      decimals: 18,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png?1547034700",
    },
    {
      name: "Aave",
      symbol: "AAVE",
      address: "0xd6df932a45c0f255f85145f286ea0b292b21c90b",
      decimals: 18,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/12645/small/AAVE.png?1601374110",
    },
    {
      name: "BNB",
      symbol: "BNB",
      address: "0x3ba4c387f786bfee076a58914f5bd38d668b42c3",
      decimals: 18,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png?1644979850",
    },
    {
      name: "Curve",
      symbol: "CRV",
      address: "0x172370d5cd63279efa6d502dab29171933a610af",
      decimals: 18,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/12124/small/Curve.png?1597369484",
    },
    {
      name: "Frax",
      symbol: "FRAX",
      address: "0x45c32fa6df82ead1e2ef74d17b76547eddfaff89",
      decimals: 18,
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/13422/small/FRAX_icon.png?1679886922",
    },
    {
      name: "DAI",
      symbol: "DAI",
      address: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
      decimals: 18,
      isStable: true,
      imageUrl: "	https://assets.coingecko.com/coins/images/9956/small/dai.png?1636636734",
    },
    {
      name: "Tether USD",
      symbol: "USDT",
      address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
      decimals: 6,
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether.png?1668148663",
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
      decimals: 6,
      isStable: true,
      isCollateralToken: true,
      imageUrl: "https://assets.coingecko.com/coins/images/27520/small/usdc.png?1664360155",
    },
  ],
  [CRONOS]: [
    {
      name: "CRO",
      symbol: "CRO",
      address: ethers.constants.AddressZero,
      decimals: 18,
      isNative: true,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/7310/thumb/cro_token_logo.png?1669699773",
    },
    {
      name: "Wrapped CRO",
      symbol: "WCRO",
      address: "0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23",
      decimals: 18,
      isWrapped: true,
      baseSymbol: "CRO",
      imageUrl: "https://assets.coingecko.com/coins/images/7310/thumb/cro_token_logo.png?1669699773",
    },
    {
      name: "Bitcoin",
      symbol: "BTC",
      address: "0x062e66477faf219f25d27dced647bf57c3107d52",
      decimals: 8,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/26115/thumb/btcb.png?1655921693",
    },
    {
      name: "Ether",
      symbol: "ETH",
      address: "0xe44fd7fcb2b1581822d0c862b68222998a0c299a",
      decimals: 18,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/2518/thumb/weth.png?1628852295",
    },
    {
      name: "ATOM",
      symbol: "ATOM",
      address: "0xb888d8dd1733d72681b30c00ee76bde93ae7aa93",
      decimals: 6,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/1481/thumb/cosmos_hub.png?1555657960",
    },
    {
      name: "ADA",
      symbol: "ADA",
      address: "0x0e517979c2c1c1522ddb0c73905e0d39b3f990c0",
      decimals: 6,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/975/thumb/cardano.png?1547034860",
    },
    {
      name: "Dogecoin",
      symbol: "DOGE",
      address: "0x1a8e39ae59e5556b56b76fcba98d22c9ae557396",
      decimals: 8,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/5/thumb/dogecoin.png?1547792256",
    },
    {
      name: "DAI",
      symbol: "DAI",
      address: "0xf2001b145b43032aaf5ee2884e456ccd805f677d",
      decimals: 18,
      isStable: true,
      imageUrl: "	https://assets.coingecko.com/coins/images/9956/small/dai.png?1636636734",
    },
    {
      name: "Tether USD",
      symbol: "USDT",
      address: "0x66e428c3f67a68878562e79a0234c1f83c208770",
      decimals: 6,
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether.png?1668148663",
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      address: "0xc21223249ca28397b4b6541dffaecc539bff0c59",
      decimals: 6,
      isStable: true,
      isCollateralToken: true,
      imageUrl: "https://assets.coingecko.com/coins/images/27520/small/usdc.png?1664360155",
    },
  ],
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
  [POLYGON]: [
    {
      name: "BLU",
      symbol: "BLU",
      address: getContract(POLYGON, "GMX"),
      decimals: 18,
      imageUrl: "https://assets.coingecko.com/coins/images/18323/small/arbit.png?1631532468",
    },
    {
      name: "Escrowed BLU",
      symbol: "esBLU",
      address: getContract(POLYGON, "ES_GMX"),
      decimals: 18,
    },
    {
      name: "BLU LP",
      symbol: "BLP",
      address: getContract(POLYGON, "GLP"),
      decimals: 18,
      imageUrl: "https://github.com/BlueSpade-Dex/gmx-assets/blob/main/GMX-Assets/PNG/GLP_LOGO%20ONLY.png?raw=true",
    },
  ],
  [CRONOS]: [
    {
      name: "Bluespade",
      symbol: "BLU",
      address: getContract(CRONOS, "GMX"),
      decimals: 18,
      imageUrl: "",
    },
    {
      name: "Escrowed BLU",
      symbol: "esBLU",
      address: getContract(CRONOS, "ES_GMX"),
      decimals: 18,
    },
    {
      name: "BLU LP",
      symbol: "BLP",
      address: getContract(CRONOS, "GLP"),
      decimals: 18,
      imageUrl: "",
    },
  ],
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
  [POLYGON]: {
    // POLYGON
    GMX: {
      name: "BLU",
      symbol: "BLU",
      decimals: 18,
      address: getContract(POLYGON, "GMX"),
      imageUrl: "https://assets.coingecko.com/coins/images/18323/small/arbit.png?1631532468",
    },
    GLP: {
      name: "BLU LP",
      symbol: "BLP",
      decimals: 18,
      address: getContract(POLYGON, "StakedGlpTracker"), // address of fsGLP token because user only holds fsGLP
      imageUrl: "https://github.com/BlueSpade-Dex/gmx-assets/blob/main/GMX-Assets/PNG/GLP_LOGO%20ONLY.png?raw=true",
    },
  },
  [CRONOS]: {
    // CRONOS
    GMX: {
      name: "Bluespade",
      symbol: "BLU",
      decimals: 18,
      address: getContract(CRONOS, "GMX"),
      imageUrl: "",
    },
    GLP: {
      name: "BLU LP",
      symbol: "BLP",
      decimals: 18,
      address: getContract(CRONOS, "StakedGlpTracker"), // address of fsGLP token because user only holds fsGLP
      imageUrl: "",
    },
  },
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
  [POLYGON]: {
    GMX: {
      polygon: "https://polygonscan.com/address/0x759d34685468604c695De301ad11A9418e2f1038",
    },
    GLP: {
      polygon: "https://polygonscan.com/address/0xdF4F9BBb17874371bBb0c8d9D2a6c131ffb19d23",
    },
    MATIC: {
      coingecko: "https://www.coingecko.com/en/coins/polygon",
    },
    WMATIC: {
      coingecko: "https://www.coingecko.com/en/coins/polygon",
      polygon: "https://polygonscan.com/address/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    },
    BTC: {
      coingecko: "https://www.coingecko.com/en/coins/wrapped-bitcoin",
      polygon: "https://polygonscan.com/address/0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
    },
    ETH: {
      coingecko: "https://www.coingecko.com/en/coins/weth",
      polygon: "https://polygonscan.com/address/0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    },
    LINK: {
      coingecko: "https://www.coingecko.com/en/coins/chainlink",
      polygon: "https://polygonscan.com/address/0xb0897686c545045aFc77CF20eC7A532E3120E0F1",
    },
    AAVE: {
      coingecko: "https://www.coingecko.com/en/coins/aave",
      polygon: "https://polygonscan.com/address/0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
    },
    BNB: {
      coingecko: "https://www.coingecko.com/en/coins/bnb",
      polygon: "https://polygonscan.com/address/0x3BA4c387f786bFEE076A58914F5Bd38d668B42c3",
    },
    CRV: {
      coingecko: "https://www.coingecko.com/en/coins/curve-dao-token",
      polygon: "https://polygonscan.com/address/0x172370d5Cd63279eFa6d502DAB29171933a610AF",
    },
    FRAX: {
      coingecko: "https://www.coingecko.com/en/coins/frax",
      polygon: "https://polygonscan.com/address/0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89",
    },
    DAI: {
      coingecko: "https://www.coingecko.com/en/coins/dai",
      polygon: "https://polygonscan.com/address/0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    },
    USDT: {
      coingecko: "https://www.coingecko.com/en/coins/tether",
      polygon: "https://polygonscan.com/address/0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    },
    USDC: {
      coingecko: "https://www.coingecko.com/en/coins/usd-coin",
      polygon: "https://polygonscan.com/address/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    },
  },
  [CRONOS]: {
    GMX: {
      cronos: "https://cronoscan.com/address/0x1542bA4CA0fb6D1B4476a933B292002fd1959A52",
    },
    GLP: {
      cronos: "https://cronoscan.com/address/0xB4d8D3B6b165091bf7A03744442960C771ccE3F0",
    },
    CRO: {
      coingecko: "https://www.coingecko.com/en/coins/cronos",
    },
    WCRO: {
      coingecko: "https://www.coingecko.com/en/coins/cronos",
      cronos: "https://cronoscan.com/address/0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23",
    },
    BTC: {
      coingecko: "https://www.coingecko.com/en/coins/wrapped-bitcoin",
      cronos: "https://cronoscan.com/address/0x062e66477faf219f25d27dced647bf57c3107d52",
    },
    ETH: {
      coingecko: "https://www.coingecko.com/en/coins/weth",
      cronos: "https://cronoscan.com/address/0xe44fd7fcb2b1581822d0c862b68222998a0c299a",
    },
    ATOM: {
      coingecko: "https://www.coingecko.com/en/coins/cosmos-hub",
      cronos: "https://cronoscan.com/address/0xb888d8dd1733d72681b30c00ee76bde93ae7aa93",
    },
    ADA: {
      coingecko: "https://www.coingecko.com/en/coins/cardano",
      cronos: "https://cronoscan.com/address/0x0e517979c2c1c1522ddb0c73905e0d39b3f990c0",
    },
    DOGE: {
      coingecko: "https://www.coingecko.com/en/coins/dogecoin",
      cronos: "https://cronoscan.com/address/0x1a8e39ae59e5556b56b76fcba98d22c9ae557396",
    },
    DAI: {
      coingecko: "https://www.coingecko.com/en/coins/dai",
      cronos: "https://cronoscan.com/address/0xf2001b145b43032aaf5ee2884e456ccd805f677d",
    },
    USDT: {
      coingecko: "https://www.coingecko.com/en/coins/tether",
      cronos: "https://cronoscan.com/address/0x66e428c3f67a68878562e79a0234c1f83c208770",
    },
    USDC: {
      coingecko: "https://www.coingecko.com/en/coins/usd-coin",
      cronos: "https://cronoscan.com/address/0xc21223249ca28397b4b6541dffaecc539bff0c59",
    },
  },
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

const CHAIN_IDS = [POLYGON, CRONOS, SKALE];

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