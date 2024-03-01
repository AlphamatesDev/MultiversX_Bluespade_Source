import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { Trans } from "@lingui/macro";

import gmxBigIcon from "img/ic_xy_finance.svg";

import { isHomeSite } from "lib/legacy";

import { useWeb3React } from "@web3-react/core";

// import APRLabel from "../APRLabel/APRLabel";
import { HeaderLink } from "../Header/HeaderLink";
import { switchNetwork } from "lib/wallets";
import { useChainId } from "lib/chains";
// import ExternalLink from "components/ExternalLink/ExternalLink";
import "./BridgeCard.css"

export default function BridgeCard({ showRedirectModal, redirectPopupTimestamp }) {
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

  // const BuyLink = ({ className, to, children, network }) => {
  //   if (isHome && showRedirectModal) {
  //     return (
  //       <HeaderLink
  //         to={to}
  //         className={className}
  //         redirectPopupTimestamp={redirectPopupTimestamp}
  //         showRedirectModal={showRedirectModal}
  //       >
  //         {children}
  //       </HeaderLink>
  //     );
  //   }

  //   return (
  //     <Link to={to} className={className} onClick={() => changeNetwork(network)}>
  //       {children}
  //     </Link>
  //   );
  // };

  return (
    <div className="Home-token-card-options bridge">
      <div className="Home-token-card-option">
        <div className="Home-token-card-option-icon">
          <img src={gmxBigIcon} alt="bluBigIcon" /> Bridge BLU on Cronos and Polygon
        </div>
        <hr />
        <div className="Home-token-card-option-info">
          <div className="Home-token-card-option-title">
            <Trans>XY Finance is a cross-chain interoperability protocol aggregating DEXs & bridges. With the ultimate routing across multi-chains, borderless and seamless swapping is just one click away.</Trans>
          </div>
          <div className="Home-token-card-option-action">
            <a href="https://app.xy.finance/" target="_blank" rel="noreferrer" className="default-btn buy">
              <Trans>Go to XY Finance</Trans>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
