import { CRONOS, POLYGON, SKALE } from "config/chains";
import { getContract } from "config/contracts";

const CRONOS_GMX = getContract(CRONOS, "GMX");
const POLYGON_GMX = getContract(POLYGON, "GMX");
const SKALE_GMX = getContract(SKALE, "GMX");

type Exchange = {
  name: string;
  icon: string;
  networks: number[];
  link?: string;
  links?: { [CRONOS]: string; [POLYGON]: string };
};

export const EXTERNAL_LINKS = {
  [CRONOS]: {
    bungee: `https://multitx.bungee.exchange/?toChainId=5&toTokenAddress=${CRONOS_GMX}`,
    banxa: "https://gmx.banxa.com/?coinType=ETH&fiatType=USD&fiatAmount=500&blockchain=cronos",
    networkWebsite: "https://ethereum.org/",
    buyGmx: {
      banxa: "https://gmx.banxa.com/?coinType=GMX&fiatType=USD&fiatAmount=500&blockchain=cronos",
      uniswap: `https://candycity.finance/swap?chainId=25&inputCurrency=CRO&outputCurrency=${CRONOS_GMX}`,
    },
  },
  [POLYGON]: {
    bungee: `https://multitx.bungee.exchange/?toChainId=5&toTokenAddress=${POLYGON_GMX}`,
    banxa: "https://gmx.banxa.com/?coinType=ETH&fiatType=USD&fiatAmount=500&blockchain=polygon",
    networkWebsite: "https://ethereum.org/",
    buyGmx: {
      banxa: "https://gmx.banxa.com/?coinType=GMX&fiatType=USD&fiatAmount=500&blockchain=polygon",
      uniswap: `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${POLYGON_GMX}`,
    },
  },
  [SKALE]: {
    bungee: `https://multitx.bungee.exchange/?toChainId=5&toTokenAddress=${SKALE_GMX}`,
    banxa: "https://gmx.banxa.com/?coinType=ETH&fiatType=USD&fiatAmount=500&blockchain=skale",
    networkWebsite: "https://ethereum.org/",
    buyGmx: {
      banxa: "https://gmx.banxa.com/?coinType=GMX&fiatType=USD&fiatAmount=500&blockchain=skale",
      uniswap: `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${SKALE_GMX}`,
    },
  },
};

export const TRANSFER_EXCHANGES: Exchange[] = [
];

export const CENTRALISED_EXCHANGES: Exchange[] = [
];

export const BRIDGE_EXCHANGES: Exchange[] = [
  {
    name: "XY Finance",
    icon: "ic_xy_finance.svg",
    link: "https://app.xy.finance/",
    networks: [CRONOS, POLYGON],
  },
];