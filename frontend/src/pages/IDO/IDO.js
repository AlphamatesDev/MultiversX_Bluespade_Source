import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";

import IDOContent from "components/IDO/IDOContent";
import Footer from "components/Footer/Footer";
import "./IDO.css";

import { Trans } from "@lingui/macro";
import { useChainId } from "lib/chains";
import { POLYGON } from "config/chains";
import SEO from "components/Common/SEO";
import { getPageTitle } from "lib/legacy";
import { useWeb3React } from "@web3-react/core";
import { switchNetwork } from "lib/wallets";

export default function IDO(props) {
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
        chainId === POLYGON ?
        <IDOContent {...props} isBuying={isBuying} setIsBuying={setIsBuying} />
        :
        <SEO title={getPageTitle("Bluespade is on IDO")}>
          <div className="page-layout">
            <div className="page-not-found-container">
              <div className="page-not-found">
                <h2>
                  <Trans>Bluespade is conducting IDO on the Polygon network.</Trans>
                </h2>
                <p className="ido-go-back">
                  <span onClick={() => onNetworkSelect(POLYGON)}>Switch to Polygon</span>
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
