import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { Trans } from "@lingui/macro";

import gmxBigIcon from "img/ic_gmx_custom.svg";
import glpBigIcon from "img/ic_glp_custom.svg";

import { isHomeSite } from "lib/legacy";

import { useWeb3React } from "@web3-react/core";

import APRLabel from "../APRLabel/APRLabel";
import { HeaderLink } from "../Header/HeaderLink";
import { SKALE } from "config/chains";
import { switchNetwork } from "lib/wallets";
import { useChainId } from "lib/chains";
import ExternalLink from "components/ExternalLink/ExternalLink";
import "./TokenCard.css"

export default function TokenCard({ showRedirectModal, redirectPopupTimestamp }) {
  const isHome = isHomeSite();
  const { chainId } = useChainId();
  const { active } = useWeb3React();

  const changeNetwork = useCallback(
    (network) => {
      if (network === chainId) {
        return;
      }
      if (!active) {
        setTimeout(() => {
          return switchNetwork(network, active);
        }, 500);
      } else {
        return switchNetwork(network, active);
      }
    },
    [chainId, active]
  );

  const BuyLink = ({ className, to, children, network }) => {
    if (isHome && showRedirectModal) {
      return (
        <HeaderLink
          to={to}
          className={className}
          redirectPopupTimestamp={redirectPopupTimestamp}
          showRedirectModal={showRedirectModal}
        >
          {children}
        </HeaderLink>
      );
    }

    return (
      <Link to={to} className={className} onClick={() => changeNetwork(network)}>
        {children}
      </Link>
    );
  };

  return (
    <div className="Home-token-card-options">
      <div className="Home-token-card-option">
        <div className="Home-token-card-option-icon">
          <img src={gmxBigIcon} alt="bluBigIcon" /> BLU
        </div>
        <hr />
        <div className="Home-token-card-option-info">
          <div className="Home-token-card-option-title">
            <Trans>BLU is the utility and governance token. Accrues 30% of the platform's generated fees.</Trans>
          </div>
          <div className="Home-token-card-option-apr">
            <Trans>Skale APR:</Trans> <APRLabel chainId={SKALE} label="gmxAprTotal" key="SKALE" />
          </div>
          <div className="Home-token-card-option-action">
            <BuyLink to="/buy_blu" className="default-btn buy" network={SKALE}>
              <Trans>Buy on Skale</Trans>
            </BuyLink>
            <ExternalLink href="https://bluespadexyz.gitbook.io/bluespade/usdblu" className="default-btn read-more">
              <Trans>Read more</Trans>
            </ExternalLink>
          </div>
        </div>
      </div>
      <div className="Home-token-card-option">
        <div className="Home-token-card-option-icon">
          <img src={glpBigIcon} alt="blpBigIcon" /> BLP
        </div>
        <hr />
        <div className="Home-token-card-option-info">
          <div className="Home-token-card-option-title">
            <Trans>BLP is the liquidity provider token. Accrues 70% of the platform's generated fees.</Trans>
          </div>
          <div className="Home-token-card-option-apr">
            <Trans>Skale APR:</Trans> <APRLabel chainId={SKALE} label="glpAprTotal" key="SKALE" />
          </div>
          <div className="Home-token-card-option-action">
            <BuyLink to="/buy_blp" className="default-btn buy" network={SKALE}>
              <Trans>Buy on Skale</Trans>
            </BuyLink>
            <a
              href="https://bluespadexyz.gitbook.io/bluespade/usdblp"
              target="_blank"
              rel="noreferrer"
              className="default-btn read-more"
            >
              <Trans>Read more</Trans>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
