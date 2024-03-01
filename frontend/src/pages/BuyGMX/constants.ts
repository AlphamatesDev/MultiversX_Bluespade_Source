import { SKALE } from "config/chains";
import { getContract } from "config/contracts";

const SKALE_GMX = getContract(SKALE, "GMX");

type Exchange = {
  name: string;
  icon: string;
  networks: number[];
  link?: string;
  links?: { [SKALE]: string };
};

export const EXTERNAL_LINKS = {
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
    networks: [SKALE],
  },
];