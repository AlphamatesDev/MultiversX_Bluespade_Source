// import React, { useCallback } from "react";
import Footer from "components/Footer/Footer";
import "./BuyGMX.css";
// import { useWeb3React } from "@web3-react/core";
import { Trans, t } from "@lingui/macro";
import Button from "components/Common/Button";
import { SKALE, getChainName } from "config/chains";
// import { switchNetwork } from "lib/wallets";
import { useChainId } from "lib/chains";
import Card from "components/Common/Card";
// import { importImage } from "lib/legacy";
// import ExternalLink from "components/ExternalLink/ExternalLink";

// import Banxa from "img/ic_banxa.svg";
// import Uniswap from "img/ic_uni_arbitrum.svg";
import Candicity from "img/ic_candycity_cronos.svg";
// import Traderjoe from "img/ic_traderjoe.png";
// import Bungee from "img/ic_bungee.png";
// import O3 from "img/ic_o3.png";
// import Binance from "img/ic_binance.svg";
// import ohmArbitrum from "img/ic_olympus_arbitrum.svg";
import { /*CENTRALISED_EXCHANGES, BRIDGE_EXCHANGES,*/ EXTERNAL_LINKS/*, TRANSFER_EXCHANGES*/ } from "./constants";

export default function BuyGMX() {
  const { chainId } = useChainId();
  // const isSkale = chainId === SKALE;
  // const { active } = useWeb3React();
  // const nativeTokenSymbol = getConstant(chainId, "nativeTokenSymbol");
  const externalLinks = EXTERNAL_LINKS[chainId];

  // const onNetworkSelect = useCallback(
  //   (value) => {
  //     if (value === chainId) {
  //       return;
  //     }
  //     return switchNetwork(value, active);
  //   },
  //   [chainId, active]
  // );

  return (
    <div className="default-container page-layout Buy-blu">
      <div className='hero-section'>
        <div className="section-title-block">
          <div className="section-title-content">
            <div className="Page-title">
              <Trans>Buy BLU on {getChainName(chainId)}</Trans>
            </div>
            <div className="Page-description">
              <Trans>Choose to buy from decentralized or centralized exchanges.</Trans>
              <br />
              {/* <Trans>
                To purchase BLU on the Polygon blockchain, please{" "}
                <span onClick={() => onNetworkSelect(isSkale ? CRONOS : POLYGON)}>change your network</span>.
              </Trans> */}
            </div>
          </div>
        </div>
      </div>
      <div className='BuyGMXGLP-content'>
        <div className="cards-row">
          <DecentralisedExchanges chainId={chainId} externalLinks={externalLinks} />
          {/* <CentralisedExchanges chainId={chainId} externalLinks={externalLinks} /> */}
        </div>

        {/* {isSkale ? (
          <div className="section-title-block mt-top">
            <div className="section-title-content">
              <div className="Page-title">
                <Trans>Buy or Transfer ETH to Cronos</Trans>
              </div>
              <div className="Page-description">
                <Trans>Buy ETH directly to Cronos or transfer it there.</Trans>
              </div>
            </div>
          </div>
        ) : (
          <div className="section-title-block mt-top">
            <div className="section-title-content">
              <div className="Page-title">
                <Trans>Buy or Transfer ETH to Polygon</Trans>
              </div>
              <div className="Page-description">
                <Trans>Buy ETH directly to Polygon or transfer it there.</Trans>
              </div>
            </div>
          </div>
        )} */}

        {/* <div className="cards-row">
          <Card title={t`Buy ${nativeTokenSymbol}`}>
            <div className="App-card-content">
              <div className="BuyGMXGLP-description">
                {isSkale ? (
                  <Trans>
                    You can buy CRO directly on{" "}
                    <ExternalLink href={externalLinks.networkWebsite}>Cronos</ExternalLink> using these options:
                  </Trans>
                ) : (
                  <Trans>
                    You can buy ETH directly on{" "}
                    <ExternalLink href={externalLinks.networkWebsite}>Polygon</ExternalLink> using these options:
                  </Trans>
                )}
              </div>
              <div className="buttons-group">
                <Button href={externalLinks.bungee} imgSrc={Bungee}>
                  Bungee
                </Button>
                <Button href={externalLinks.o3} imgSrc={O3}>
                  O3
                </Button>
                <Button href={externalLinks.banxa} imgSrc={Banxa}>
                  Banxa
                </Button>
              </div>
            </div>
          </Card>
          <Card title={t`Transfer ${nativeTokenSymbol}`}>
            <div className="App-card-content">
              {isSkale ? (
                <div className="BuyGMXGLP-description">
                  <Trans>You can transfer CRO from other networks to Cronos using any of the below options:</Trans>
                </div>
              ) : (
                <div className="BuyGMXGLP-description">
                  <Trans>You can transfer AVAX from other networks to Polygon using any of the below options:</Trans>
                </div>
              )}
              <div className="buttons-group">
                {TRANSFER_EXCHANGES.filter((e) => e.networks.includes(chainId)).map((exchange) => {
                  const icon = importImage(exchange.icon) || "";
                  return (
                    <Button key={exchange.name} href={exchange.link} imgSrc={icon}>
                      {exchange.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          </Card>
        </div> */}
      </div>
      <Footer />
    </div>
  );
}

function DecentralisedExchanges({ chainId, externalLinks }) {
  const isSkale = chainId === SKALE;
  return (
    <Card title={t`Buy BLU from a Decentralized Exchange`}>
      <div className="App-card-content">
        {isSkale ? (
          <div className="exchange-info-group">
            <div className="BuyGMXGLP-description">
              <Trans>Buy BLU from Ruby (make sure to select Skale):</Trans>
            </div>
            <div className="buttons-group col-1">
              <Button imgSrc={Candicity} href={externalLinks.buyGmx.uniswap}>
                <Trans>Ruby Exchange</Trans>
              </Button>
            </div>
          </div>
        ) : (
          <div className="exchange-info-group">
            <div className="BuyGMXGLP-description">
              <Trans>The public-sale of BLU token on the Skale network is not yet available.</Trans>
            </div>
            {/* <div className="BuyGMXGLP-description">
              <Trans>Buy GMX from Uniswap (make sure to select Polygon):</Trans>
            </div>
            <div className="buttons-group col-1">
              <Button imgSrc={Uniswap} href={externalLinks.buyGmx.uniswap}>
                <Trans>Uniswap</Trans>
              </Button>
            </div> */}
          </div>
        )}
        <div className="exchange-info-group">
          <div className="BuyGMXGLP-description">
            {/* <Trans>Buy BLU using Decentralized Exchange Aggregators:</Trans> */}
          </div>
          <div className="buttons-group">
            {/* {DECENTRALISED_AGGRIGATORS.filter((e) => e.networks.includes(chainId)).map((exchange) => {
              const icon = importImage(exchange.icon) || "";
              const link = exchange.links ? exchange.links[chainId] : exchange.link;
              return (
                <Button key={exchange.name} imgSrc={icon} href={link}>
                  <Trans>{exchange.name}</Trans>
                </Button>
              );
            })} */}
          </div>
        </div>
        {/* <div className="exchange-info-group">
          <div className="BuyGMXGLP-description">
            <Trans>Buy BLU using any token from any network:</Trans>
          </div>
          <div className="buttons-group">
            <Button href={externalLinks.bungee} imgSrc={Bungee}>
              Bungee
            </Button>
            <Button href={externalLinks.o3} imgSrc={O3}>
              O3
            </Button>
          </div>
        </div> */}
        {/* {isSkale && (
          <div className="exchange-info-group">
            <div className="BuyGMXGLP-description">
              <Trans>GMX bonds can be bought on Olympus Pro with a discount and a small vesting period:</Trans>
            </div>
            <div className="buttons-group col-1">
              <Button imgSrc={ohmArbitrum} href="https://pro.olympusdao.finance/#/partners/GMX">
                Olympus Pro
              </Button>
            </div>
          </div>
        )} */}
      </div>
    </Card>
  );
}

// function CentralisedExchanges({ chainId, externalLinks }) {
//   return (
//     <Card title={t`Bridge BLU on Cronos and Polygon`}>
//       <div className="App-card-content">
//         <div className="exchange-info-group">
//           <div className="BuyGMXGLP-description">
//             <Trans>Bridge BLU from XY Finance:</Trans>
//           </div>
//           <div className="buttons-group">
//             {BRIDGE_EXCHANGES.filter((e) => e.networks.includes(chainId)).map((exchange) => {
//               const icon = importImage(exchange.icon) || "";
//               return (
//                 <Button key={exchange.name} href={exchange.link} imgSrc={icon}>
//                   {exchange.name}
//                 </Button>
//               );
//             })}
//           </div>
//         </div>

//         <div className="exchange-info-group">
//           <div className="BuyGMXGLP-description">
//             {/* <Trans>Buy BLU using FIAT gateways:</Trans> */}
//           </div>
//           <div className="buttons-group col-2">
//             {/* <Button href="https://www.binancecnt.com/en/buy-sell-crypto" imgSrc={Binance}>
//               Binance Connect
//             </Button>
//             <Button href={externalLinks.buyGmx.banxa} imgSrc={Banxa}>
//               Banxa
//             </Button> */}
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// }
