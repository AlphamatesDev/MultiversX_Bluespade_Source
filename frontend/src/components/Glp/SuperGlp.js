// import React, { useRef, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import useSWR from "swr";

import "./SuperGlp.css";
import ProgressBar from "./progress-bar.component";
import superBlpImg from "img/ic_super_blp.svg";
import { useChainId } from "lib/chains";
import { getContract } from "config/contracts";
import GLP from "abis/GLP.json";
import { contractFetcher } from "lib/contracts";
import { bigNumberify, expandDecimals } from "lib/numbers";

const tierDataSkale = [
    { name: "Tier1", start: 0, end: 250000, rewards: "125,000", per_blp: "0.5", start_show: "$0", end_show: "250K" },
    { name: "Tier2", start: 250001, end: 500000, rewards: "93,750", per_blp: "0.375", start_show: "250K", end_show: "500K" },
    { name: "Tier3", start: 500001, end: 1000000, rewards: "100,000", per_blp: "0.2", start_show: "500K", end_show: "1M" },
    { name: "Tier4", start: 1000001, end: 1500000, rewards: "100,000", per_blp: "0.2", start_show: "1M", end_show: "1.5M" },
    { name: "Tier5", start: 1500001, end: 2000000, rewards: "100,000", per_blp: "0.2", start_show: "1.5M", end_show: "2M" },
    { name: "Tier6", start: 2000001, end: 3000000, rewards: "150,000", per_blp: "0.15", start_show: "2M", end_show: "3M" },
];

export default function SuperGlp(props) {
//   const { } = props;

  const { active, library } = useWeb3React();
  const { chainId } = useChainId();
  
  const glpAddress = getContract(chainId, "GLP");

  const { data: glpSupplyByDecimals } = useSWR(
    [`SuperGlp:glpSupply:${active}`, chainId, glpAddress, "totalSupply"],
    {
      fetcher: contractFetcher(library, GLP),
    }
  );

  const tierData = tierDataSkale;

  let glpSupply = glpSupplyByDecimals ? bigNumberify(glpSupplyByDecimals) : bigNumberify(0);
  glpSupply = glpSupply.div(expandDecimals(1, 18)).toString();
  glpSupply = parseInt(glpSupply, 10);

  const glpSupplyByK = (glpSupply / 1000).toFixed(2);

  const getCurrentTier = (chainId) => {
    let i = 0;
    for (i = 0; i < tierData.length; i ++) {
        const tierItem = tierData[i];
        if (glpSupply >= tierItem.start && glpSupply <= tierItem.end) {
            return i + 1;
        }
    }
    return i;
  }

  const currentTier = getCurrentTier(chainId);

  const getCompletedPercentage = (tier) => {
    if (tier < currentTier)
        return 100;
    else if (tier > currentTier)
        return 0;
    else {
        const tierItem = tierData[tier - 1];
        const res = (glpSupply - tierItem.start) / (tierItem.end - tierItem.start) * 100;
        return res > 100 ? 100 : res;
    }
  }

  const getFilledAmountForTier = (tier) => {
    if (tier < currentTier)
        return tierData[tier - 1].end;
    else if (tier > currentTier)
        return 0;
    else {
        const tierStart = tierData[tier - 1].start;
        return glpSupply - tierStart;
    }
  }

  const getTierCardOptionForTier = (tier) => {
    if (tier === currentTier)
        return "Tier-card-option-focused";
    else
        return "Tier-card-option";
  }
  
  const getTierCardContentLeftForTier = (tier) => {
    if (tier === currentTier)
        return "Tier-card-content-left-focused";
    else
        return "Tier-card-content-left";
  }
  
  const getTierCardContentRightSubForTier = (tier) => {
    if (tier === currentTier)
        return "Tier-card-content-right-sub-focused";
    else
        return "Tier-card-content-right-sub";
  }
  
  const getTierCardContentRightRewardForTier = (tier) => {
    if (tier === currentTier)
        return "Tier-card-content-right-reward-focused";
    else
        return "Tier-card-content-right-reward";
  }

  return (
    <div className="Super-Glp">
        
        <div className="Super-blp-title">Super BLP Rewards on {"Skale"}</div>

        <div className="Super-blp-description">Earn High APR Bonus Rewards For Minting Early</div>

        <div className="Top-card-options">
            <div className="Top-card-option-left">
                <div className="Top-card-option-left-image-div">
                    <img className="Top-card-option-left-image" src={superBlpImg} alt="MetaMask" />
                </div>
                <div className="Top-card-option-left-status">
                    <div className="Top-card-option-left-status-text1">Current Tier {currentTier}</div>
                    <div className="Top-card-option-left-status-text2">{tierData[currentTier - 1].rewards}</div>
                    <div className="Top-card-option-left-status-text3">$BLU in Rewards</div>
                </div>
            </div>
            <div className="Top-card-option-right">
                <div className="Top-card-option-right-content">
                    <div className="Tier-card-row">
                        <div className="Top-card-option-right-content-start">{tierData[currentTier - 1].start_show}</div>
                        <div>{glpSupplyByK}K Filled</div>
                    </div>                    
                    <ProgressBar bgcolor={"#1be1cf"} completed={getCompletedPercentage(currentTier)} height={20} />
                    <a href="/#/buy_blp" target="_self">
                        <button className="Top-card-option-right-btn">
                            Buy BLP
                        </button>
                    </a>
                </div>
            </div>
        </div>

        <div className="Tier-events-text">Super BLP Event</div>

        <div className="Tier-card-options">
        
            <div className={getTierCardOptionForTier(1)}>
                <div className="Tier-card-option-title">
                    <div className="Tier-card-option-title-text">Tier 1</div>
                    <div className="Tier-card-option-title-progress">
                        <div>{(getFilledAmountForTier(1) / 1000).toFixed(2)}K Filled</div>
                        <ProgressBar bgcolor={"#1be1cf"} completed={getCompletedPercentage(1)} height={10} />
                    </div>
                </div>
                <hr />
                <div>
                <div className="Tier-card-row">
                    <div className={getTierCardContentLeftForTier(1)}>Minted $BLP</div>
                    <div className="Tier-card-content-right-range">${tierData[0].start_show} - {tierData[0].end_show}</div>
                </div>
                <div className="Tier-card-row">
                    <div className={getTierCardContentLeftForTier(1)}>Rewards</div>
                    <div className="Tier-card-content-right">
                        <div className={getTierCardContentRightRewardForTier(1)}>{tierData[0].rewards} $BLU</div>
                        <div className={getTierCardContentRightSubForTier(1)}>{tierData[0].per_blp} $BLU / $BLP</div>
                    </div>
                </div>
                </div>
            </div>

            <div className={getTierCardOptionForTier(2)}>
                <div className="Tier-card-option-title">
                    <div className="Tier-card-option-title-text">Tier 2</div>
                    <div className="Tier-card-option-title-progress">
                        <div>{(getFilledAmountForTier(2) / 1000).toFixed(2)}K Filled</div>
                        <ProgressBar bgcolor={"#1be1cf"} completed={getCompletedPercentage(2)} height={10} />
                    </div>
                </div>
                <hr />
                <div>
                <div className="Tier-card-row">
                    <div className={getTierCardContentLeftForTier(2)}>Minted $BLP</div>
                    <div className="Tier-card-content-right-range">${tierData[1].start_show} - {tierData[1].end_show}</div>
                </div>
                <div className="Tier-card-row">
                    <div className={getTierCardContentLeftForTier(2)}>Rewards</div>
                    <div className="Tier-card-content-right">
                        <div className={getTierCardContentRightRewardForTier(2)}>{tierData[1].rewards} $BLU</div>
                        <div className={getTierCardContentRightSubForTier(2)}>{tierData[1].per_blp} $BLU / $BLP</div>
                    </div>
                </div>
                </div>
            </div>

            <div className={getTierCardOptionForTier(3)}>
                <div className="Tier-card-option-title">
                    <div className="Tier-card-option-title-text">Tier 3</div>
                    <div className="Tier-card-option-title-progress">
                        <div>{(getFilledAmountForTier(3) / 1000).toFixed(2)}K Filled</div>
                        <ProgressBar bgcolor={"#1be1cf"} completed={getCompletedPercentage(3)} height={10} />
                    </div>
                </div>
                <hr />
                <div>
                <div className="Tier-card-row">
                    <div className={getTierCardContentLeftForTier(3)}>Minted $BLP</div>
                    <div className="Tier-card-content-right-range">${tierData[2].start_show} - {tierData[2].end_show}</div>
                </div>
                <div className="Tier-card-row">
                    <div className={getTierCardContentLeftForTier(3)}>Rewards</div>
                    <div className="Tier-card-content-right">
                        <div className={getTierCardContentRightRewardForTier(3)}>{tierData[2].rewards} $BLU</div>
                        <div className={getTierCardContentRightSubForTier(3)}>{tierData[2].per_blp} $BLU / $BLP</div>
                    </div>
                </div>
                </div>
            </div>

            <div className={getTierCardOptionForTier(4)}>
                <div className="Tier-card-option-title">
                    <div className="Tier-card-option-title-text">Tier 4</div>
                    <div className="Tier-card-option-title-progress">
                        <div>{(getFilledAmountForTier(4) / 1000).toFixed(2)}K Filled</div>
                        <ProgressBar bgcolor={"#1be1cf"} completed={getCompletedPercentage(4)} height={10} />
                    </div>
                </div>
                <hr />
                <div>
                <div className="Tier-card-row">
                    <div className={getTierCardContentLeftForTier(4)}>Minted $BLP</div>
                    <div className="Tier-card-content-right-range">${tierData[3].start_show} - {tierData[3].end_show}</div>
                </div>
                <div className="Tier-card-row">
                    <div className={getTierCardContentLeftForTier(4)}>Rewards</div>
                    <div className="Tier-card-content-right">
                        <div className={getTierCardContentRightRewardForTier(4)}>{tierData[3].rewards} $BLU</div>
                        <div className={getTierCardContentRightSubForTier(4)}>{tierData[3].per_blp} $BLU / $BLP</div>
                    </div>
                </div>
                </div>
            </div>

            <div className={getTierCardOptionForTier(5)}>
                <div className="Tier-card-option-title">
                    <div className="Tier-card-option-title-text">Tier 5</div>
                    <div className="Tier-card-option-title-progress">
                        <div>{(getFilledAmountForTier(5) / 1000).toFixed(2)}K Filled</div>
                        <ProgressBar bgcolor={"#1be1cf"} completed={getCompletedPercentage(5)} height={10} />
                    </div>
                </div>
                <hr />
                <div>
                <div className="Tier-card-row">
                    <div className={getTierCardContentLeftForTier(5)}>Minted $BLP</div>
                    <div className="Tier-card-content-right-range">${tierData[4].start_show} - {tierData[4].end_show}</div>
                </div>
                <div className="Tier-card-row">
                    <div className={getTierCardContentLeftForTier(5)}>Rewards</div>
                    <div className="Tier-card-content-right">
                        <div className={getTierCardContentRightRewardForTier(5)}>{tierData[4].rewards} $BLU</div>
                        <div className={getTierCardContentRightSubForTier(5)}>{tierData[4].per_blp} $BLU / $BLP</div>
                    </div>
                </div>
                </div>
            </div>

            <div className={getTierCardOptionForTier(6)}>
                <div className="Tier-card-option-title">
                    <div className="Tier-card-option-title-text">Tier 6</div>
                    <div className="Tier-card-option-title-progress">
                        <div>{(getFilledAmountForTier(6) / 1000).toFixed(2)}K Filled</div>
                        <ProgressBar bgcolor={"#1be1cf"} completed={getCompletedPercentage(6)} height={10} />
                    </div>
                </div>
                <hr />
                <div>
                <div className="Tier-card-row">
                    <div className={getTierCardContentLeftForTier(6)}>Minted $BLP</div>
                    <div className="Tier-card-content-right-range">${tierData[5].start_show} - {tierData[5].end_show}</div>
                </div>
                <div className="Tier-card-row">
                    <div className={getTierCardContentLeftForTier(6)}>Rewards</div>
                    <div className="Tier-card-content-right">
                        <div className={getTierCardContentRightRewardForTier(6)}>{tierData[5].rewards} $BLU</div>
                        <div className={getTierCardContentRightSubForTier(6)}>{tierData[5].per_blp} $BLU / $BLP</div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
  );
}
