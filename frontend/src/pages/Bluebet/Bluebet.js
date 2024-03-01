import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";

import BluebetContent from "components/Bluebet/BluebetContent";
import Footer from "components/Footer/Footer";
import "./Bluebet.css";

import { Trans } from "@lingui/macro";
import { useChainId } from "lib/chains";
import { SKALE } from "config/chains";
import SEO from "components/Common/SEO";
import { getPageTitle } from "lib/legacy";
import { useWeb3React } from "@web3-react/core";
import { switchNetwork } from "lib/wallets";

export default function Bluebet(props) {
  const { chainId } = useChainId();
  const history = useHistory();
  const [isBuying, setIsBuying] = useState(true);
  const { active } = useWeb3React();

  useEffect(() => {
    const hash = history.location.hash.replace("#", "");
    const buying = hash === "redeem" ? false : true;
    setIsBuying(buying);
  }, [history.location.hash]);

  const onNetworkSelect = useCallback(
    (value) => {
      if (value === chainId) {
        return;
      }
      return switchNetwork(value, active);
    },
    [chainId, active]
  );

  return (
    <div className="default-container page-layout Buy-sell-blp">
      {
        chainId === SKALE ?
        <BluebetContent {...props} isBuying={isBuying} setIsBuying={setIsBuying} />
        :
        <SEO title={getPageTitle("Bluespade is on Bluebet")}>
          <div className="page-layout">
            <div className="page-not-found-container">
              <div className="page-not-found">
                <h2>
                  <Trans>Bluespade is conducting Bluebet on the Skale network.</Trans>
                </h2>
                <p className="bluebet-go-back">
                  <span onClick={() => onNetworkSelect(SKALE)}>Switch to Skale</span>
                </p>
              </div>
            </div>
            <Footer />
          </div>
        </SEO>
      }      
      <Footer />
    </div>
  );
}
