import React from "react";
import { Trans } from "@lingui/macro";
import Footer from "components/Footer/Footer";
import "./Buy.css";
import TokenCard from "components/TokenCard/TokenCard";
// import BridgeCard from "components/BridgeCard/BridgeCard";
// import buyGMXIcon from "img/buy_gmx.svg";
import SEO from "components/Common/SEO";
import { getPageTitle } from "lib/legacy";

export default function BuyGMXGLP() {
  return (
    <SEO title={getPageTitle("Buy BLP or BLU")}>
      <div className="BuyGMXGLP page-layout">
        <div className="BuyGMXGLP-container default-container">
          <div className="section-title-block">
            {/* <div className="section-title-icon">
              <img src={buyGMXIcon} alt="buyGMXIcon" />
            </div> */}
            <div className="section-title-content">
              <div className="Page-title">
                <Trans>Buy BLU or BLP</Trans>
              </div>
              <div className="Page-description">
                <Trans>Stake BLU and BLP to earn rewards.</Trans>
              </div>
            </div>
          </div>
          <div className="BuyGMXGLP-gradient-bg-dark"></div>
          <TokenCard />
          {/* <BridgeCard /> */}
        </div>
        <Footer />
      </div>
    </SEO>
  );
}
