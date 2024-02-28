import React, { useState } from "react";
// import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { Trans, t } from "@lingui/macro";
import useSWR from "swr";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import TooltipComponent from "components/Tooltip/Tooltip";

import hexToRgba from "hex-to-rgba";
import { ethers } from "ethers";

import {
  USD_DECIMALS,
  GMX_DECIMALS,
  GLP_DECIMALS,
  BASIS_POINTS_DIVISOR,
  // DEFAULT_MAX_USDG_AMOUNT,
  getPageTitle,
  // importImage,
  // arrayURLFetcher,
} from "lib/legacy";
import {
  useTotalGmxInLiquidity, useGmxPrice, useTotalGmxStaked, useTotalGmxSupply,
  // useTradeVolumeHistory,
  usePositionStatesCronos, usePositionStatesPolygon, usePositionStatesSkale,
  // useTotalVolume,
  useFeesDataCronos, useFeesDataPolygon, useFeesDataSkale,
  useVolumeDataCronos, useVolumeDataPolygon, useVolumeDataSkale,
  formatNumber
} from "domain/legacy";
// import useFeesSummary from "domain/useFeesSummary";

import { getContract } from "config/contracts";

// import Vault from "abis/Vault.json";
import ReaderV2 from "abis/ReaderV2.json";
import GlpManager from "abis/GlpManager.json";
import Footer from "components/Footer/Footer";

import "./DashboardV2.css";

import gmx40Icon from "img/ic_gmx_40.svg";
import glp40Icon from "img/ic_glp_40.svg";
// import arbitrum16Icon from "img/ic_arbitrum_16.svg";
// import arbitrum24Icon from "img/ic_arbitrum_24.svg";
// import avalanche16Icon from "img/ic_avalanche_16.svg";
// import avalanche24Icon from "img/ic_avalanche_24.svg";
import cronos16Icon from "img/ic_cronos_16.svg";
import cronos24Icon from "img/ic_cronos_24.svg";
import polygon16Icon from "img/ic_polygon_16.svg";
import polygon24Icon from "img/ic_polygon_24.svg";
import skale16Icon from "img/ic_skale_16.svg";
import skale24Icon from "img/ic_skale_24.svg";
// import heroBgVideo from "img/BlueToken.webm"
// import heroBgVideo from "img/StatsVideos.webm";
// import DollarCoinsBgVideo from "img/DollarCoins.webm";

import AssetDropdown from "./AssetDropdown";
// import ExternalLink from "components/ExternalLink/ExternalLink";
import SEO from "components/Common/SEO";
import StatsTooltip from "components/StatsTooltip/StatsTooltip";
import StatsTooltipRow from "components/StatsTooltip/StatsTooltipRow";
import { CRONOS, POLYGON, SKALE, getChainName } from "config/chains";
// import { getServerUrl } from "config/backend";
import { contractFetcher } from "lib/contracts";
import { useInfoTokens } from "domain/tokens";
import { /*getTokenBySymbol,*/ getWhitelistedTokens, GLP_POOL_COLORS } from "config/tokens";
import { bigNumberify, expandDecimals, formatAmount } from "lib/numbers";
import { useChainId } from "lib/chains";
// import { formatDate } from "lib/dates";
// const ACTIVE_CHAIN_IDS = [CRONOS, POLYGON, SKALE];

const { AddressZero } = ethers.constants;

// function getVolumeInfo(hourlyVolumes) {
//   if (!hourlyVolumes || hourlyVolumes.length === 0) {
//     return {};
//   }
//   const dailyVolumes = hourlyVolumes.map((hourlyVolume) => {
//     const secondsPerHour = 60 * 60;
//     const minTime = parseInt(Date.now() / 1000 / secondsPerHour) * secondsPerHour - 24 * secondsPerHour;
//     const info = {};
//     let totalVolume = bigNumberify(0);
//     for (let i = 0; i < hourlyVolume.length; i++) {
//       const item = hourlyVolume[i].data;
//       if (parseInt(item.timestamp) < minTime) {
//         break;
//       }

//       if (!info[item.token]) {
//         info[item.token] = bigNumberify(0);
//       }

//       info[item.token] = info[item.token].add(item.volume);
//       totalVolume = totalVolume.add(item.volume);
//     }
//     info.totalVolume = totalVolume;
//     return info;
//   });
//   return dailyVolumes.reduce(
//     (acc, cv, index) => {
//       acc.totalVolume = acc.totalVolume.add(cv.totalVolume);
//       acc[ACTIVE_CHAIN_IDS[index]] = cv;
//       return acc;
//     },
//     { totalVolume: bigNumberify(0) }
//   );
// }

// function getPositionStats(positionStats) {
//   if (!positionStats || positionStats.length === 0) {
//     return null;
//   }
//   return positionStats.reduce(
//     (acc, cv, i) => {
//       acc.totalLongPositionSizes = acc.totalLongPositionSizes.add(cv.totalLongPositionSizes);
//       acc.totalShortPositionSizes = acc.totalShortPositionSizes.add(cv.totalShortPositionSizes);
//       acc[ACTIVE_CHAIN_IDS[i]] = cv;
//       return acc;
//     },
//     {
//       totalLongPositionSizes: bigNumberify(0),
//       totalShortPositionSizes: bigNumberify(0),
//     }
//   );
// }

// function getCurrentFeesUsd(tokenAddresses, fees, infoTokens) {
//   if (!fees || !infoTokens) {
//     return bigNumberify(0);
//   }

//   let currentFeesUsd = bigNumberify(0);
//   for (let i = 0; i < tokenAddresses.length; i++) {
//     const tokenAddress = tokenAddresses[i];
//     const tokenInfo = infoTokens[tokenAddress];
//     if (!tokenInfo || !tokenInfo.contractMinPrice) {
//       continue;
//     }

//     const feeUsd = fees[i].mul(tokenInfo.contractMinPrice).div(expandDecimals(1, tokenInfo.decimals));
//     currentFeesUsd = currentFeesUsd.add(feeUsd);
//   }
//   return currentFeesUsd;
// }

export default function DashboardV2() {
  const { active, library } = useWeb3React();
  const { chainId } = useChainId();
  // const totalVolume = useTotalVolume();
  const [totalVolumeCronos, totalVolumeDeltaCronos] = useVolumeDataCronos();
  const [totalVolumePolygon, totalVolumeDeltaPolygon] = useVolumeDataPolygon();
  const [totalVolumeSkale, totalVolumeDeltaSkale] = useVolumeDataSkale();

  const totalVolume = /*(totalVolumeCronos ? totalVolumeCronos : 0) + (totalVolumePolygon ? totalVolumePolygon : 0) + */(totalVolumeSkale ? totalVolumeSkale : 0)
  const totalVolumeDelta = /*(totalVolumeDeltaCronos ? totalVolumeDeltaCronos : 0) + (totalVolumeDeltaPolygon ? totalVolumeDeltaPolygon : 0) + */(totalVolumeDeltaSkale ? totalVolumeDeltaSkale : 0)

  const chainName = getChainName(chainId);
  // const { data: positionStats } = useSWR(
  //   ACTIVE_CHAIN_IDS.map((chainId) => getServerUrl(chainId, "/position_stats")),
  //   {
  //     fetcher: arrayURLFetcher,
  //   }
  // );
  const positionStatsCronos = usePositionStatesCronos(chainId);
  const positionStatsPolygon = usePositionStatesPolygon(chainId);
  const positionStatsSkale = usePositionStatesSkale(chainId);

  // const { data: hourlyVolumes } = useSWR(
  //   ACTIVE_CHAIN_IDS.map((chainId) => getServerUrl(chainId, "/hourly_volume")),
  //   {
  //     fetcher: arrayURLFetcher,
  //   }
  // );

  // const hourlyVolumes = useTradeVolumeHistory(chainId);
  // const dailyVolume = useVolumeDataCronos({from: parseInt(Date.now() / 1000) - 86400, to: parseInt(Date.now() / 1000) });


  let { total: totalGmxSupply, cronos: gmxSupplyCronos, polygon: gmxSupplyPolygon, skale: gmxSupplySkale } = useTotalGmxSupply();

  // const currentVolumeInfo = getVolumeInfo(hourlyVolumes);
  // const positionStatsInfo = getPositionStats(positionStats);
  const positionStatsInfoCronos = positionStatsCronos;
  const positionStatsInfoPolygon = positionStatsPolygon;
  const positionStatsInfoSkale = positionStatsSkale;

  const totalLongPosition = /*(positionStatsInfoCronos.totalLongPositionSizes? bigNumberify(positionStatsInfoCronos.totalLongPositionSizes) : bigNumberify(0)).add(
    positionStatsInfoPolygon.totalLongPositionSizes ? bigNumberify(positionStatsInfoPolygon.totalLongPositionSizes) : bigNumberify(0)).add(*/
    positionStatsInfoSkale.totalLongPositionSizes ? bigNumberify(positionStatsInfoSkale.totalLongPositionSizes) : bigNumberify(0)//);
  const totalShortPosition = /*(positionStatsInfoCronos.totalShortPositionSizes? bigNumberify(positionStatsInfoCronos.totalShortPositionSizes) : bigNumberify(0)).add(
    positionStatsInfoPolygon.totalShortPositionSizes ? bigNumberify(positionStatsInfoPolygon.totalShortPositionSizes) : bigNumberify(0)).add(*/
    positionStatsInfoSkale.totalShortPositionSizes ? bigNumberify(positionStatsInfoSkale.totalShortPositionSizes) : bigNumberify(0)//);

  // function getWhitelistedTokenAddresses(chainId) {
  //   const whitelistedTokens = getWhitelistedTokens(chainId);
  //   return whitelistedTokens.map((token) => token.address);
  // }

  const whitelistedTokens = getWhitelistedTokens(chainId);
  const tokenList = whitelistedTokens;
  // const visibleTokens = tokenList.filter((t) => !t.isTempHidden);
  // const visibleTokens = tokenList.filter((t) => t.isCollateralToken);

  const readerAddress = getContract(chainId, "Reader");
  // const vaultAddress = getContract(chainId, "Vault");
  const glpManagerAddress = getContract(chainId, "GlpManager");

  const gmxAddress = getContract(chainId, "GMX");
  const glpAddress = getContract(chainId, "GLP");
  const usdgAddress = getContract(chainId, "USDG");

  // const stakedGlpTrackerAddress = getContract(chainId, "StakedGlpTracker");
  const tokensForSupplyQuery = [gmxAddress, glpAddress, usdgAddress];

  const { data: aums } = useSWR([`Dashboard:getAums:${active}`, chainId, glpManagerAddress, "getAums"], {
    fetcher: contractFetcher(library, GlpManager),
  });

  const { data: totalSupplies } = useSWR(
    [`Dashboard:totalSupplies:${active}`, chainId, readerAddress, "getTokenBalancesWithSupplies", AddressZero],
    {
      fetcher: contractFetcher(library, ReaderV2, [tokensForSupplyQuery]),
    }
  );

  // const { data: totalTokenWeights } = useSWR(
  //   [`GlpSwap:totalTokenWeights:${active}`, chainId, vaultAddress, "totalTokenWeights"],
  //   {
  //     fetcher: contractFetcher(library, Vault),
  //   }
  // );

  const { infoTokens } = useInfoTokens(library, chainId, active, undefined, undefined);
  // const { infoTokens: infoTokensCronos } = useInfoTokens(null, CRONOS, active, undefined, undefined);
  // const { infoTokens: infoTokensPolygon } = useInfoTokens(null, POLYGON, active, undefined, undefined);
  // const { infoTokens: infoTokensSkale } = useInfoTokens(null, SKALE, active, undefined, undefined);

  // const { data: currentFees } = useSWR(
  //   infoTokensCronos[AddressZero].contractMinPrice && infoTokensPolygon[AddressZero].contractMinPrice && infoTokensSkale[AddressZero].contractMinPrice
  //     ? "Dashboard:currentFees"
  //     : null,
  //   {
  //     fetcher: () => {
  //       return Promise.all(
  //         ACTIVE_CHAIN_IDS.map((chainId) =>
  //           contractFetcher(null, ReaderV2, [getWhitelistedTokenAddresses(chainId)])(
  //             `Dashboard:fees:${chainId}`,
  //             chainId,
  //             getContract(chainId, "Reader"),
  //             "getFees",
  //             getContract(chainId, "Vault")
  //           )
  //         )
  //       ).then((fees) => {
  //         return fees.reduce(
  //           (acc, cv, i) => {
  //             const feeUSD = getCurrentFeesUsd(
  //               getWhitelistedTokenAddresses(ACTIVE_CHAIN_IDS[i]),
  //               cv,
  //               ACTIVE_CHAIN_IDS[i] === CRONOS ? infoTokensCronos : ""
  //             );
  //             acc[ACTIVE_CHAIN_IDS[i]] = feeUSD;
  //             acc.total = acc.total.add(feeUSD);
  //             return acc;
  //           },
  //           { total: bigNumberify(0) }
  //         );
  //       });
  //     },
  //   }
  // );

  // const { data: feesSummaryByChain } = useFeesSummary();
  // const feesSummary = feesSummaryByChain[chainId];
  // const eth = infoTokens[getTokenBySymbol(chainId, chainId === CRONOS ? "WCRO" : (chainId === POLYGON ? "WMATIC" : "SKL")).address];
  // const shouldIncludeCurrrentFees =
  //   feesSummaryByChain[chainId].lastUpdatedAt &&
  //   parseInt(Date.now() / 1000) - feesSummaryByChain[chainId].lastUpdatedAt > 60 * 60;

  // const totalFees = ACTIVE_CHAIN_IDS.map((chainId) => {
  //   if (shouldIncludeCurrrentFees && currentFees && currentFees[chainId]) {
  //     return currentFees[chainId].div(expandDecimals(1, USD_DECIMALS)).add(feesSummaryByChain[chainId].totalFees || 0);
  //   }

  //   return feesSummaryByChain[chainId].totalFees || 0;
  // })
  //   .map((v) => Math.round(v))
  //   .reduce(
  //     (acc, cv, i) => {
  //       acc[ACTIVE_CHAIN_IDS[i]] = cv;
  //       acc.total = acc.total + cv;
  //       return acc;
  //     },
  //     { total: 0 }
  //   );
  const [totalFeesCronos/*, totalFeesDeltaCronos */] = useFeesDataCronos()
  const [totalFeesPolygon/*, totalFeesDeltaPolygon */] = useFeesDataPolygon()
  const [totalFeesSkale/*, totalFeesDeltaSkale */] = useFeesDataSkale()
  const totalFees = /*(totalFeesCronos ? totalFeesCronos : 0) + (totalFeesPolygon ? totalFeesPolygon : 0) + */(totalFeesSkale ? totalFeesSkale : 0);
  // const totalFeesDelta = (totalFeesDeltaCronos ? totalFeesDeltaCronos : 0) + (totalFeesDeltaPolygon ? totalFeesDeltaPolygon : 0) + (totalFeesDeltaSkale ? totalFeesDeltaSkale : 0);

  const { gmxPrice, /*gmxPriceFromCronos, gmxPriceFromPolygon, */gmxPriceFromSkale } = useGmxPrice(
    chainId,
    undefined,
    active
  );

  let { total: totalGmxInLiquidity } = useTotalGmxInLiquidity(chainId, active);

  let { cronos: cronosStakedGmx, polygon: polygonStakedGmx, skale: skaleStakedGmx, total: totalStakedGmx } = useTotalGmxStaked();

  let gmxMarketCap;
  if (gmxPrice && totalGmxSupply) {
    gmxMarketCap = gmxPrice.mul(totalGmxSupply).div(expandDecimals(1, GMX_DECIMALS));
  }

  let stakedGmxSupplyUsd;
  if (gmxPrice && totalStakedGmx) {
    stakedGmxSupplyUsd = totalStakedGmx.mul(gmxPrice).div(expandDecimals(1, GMX_DECIMALS));
  }

  let aum;
  if (aums && aums.length > 0) {
    aum = aums[0].add(aums[1]).div(2);
  }

  let glpPrice;
  let glpSupply;
  let glpMarketCap;
  if (aum && totalSupplies && totalSupplies[3]) {
    glpSupply = totalSupplies[3];

    glpPrice = aum && aum.gt(0) && glpSupply.gt(0)
      ? aum.mul(expandDecimals(1, GLP_DECIMALS)).div(glpSupply)
      : expandDecimals(1, USD_DECIMALS);

    glpMarketCap = glpPrice.mul(glpSupply).div(expandDecimals(1, GLP_DECIMALS));
  }
  let tvl;
  if (glpMarketCap && gmxPrice && totalStakedGmx) {
    tvl = glpMarketCap.add(gmxPrice.mul(totalStakedGmx).div(expandDecimals(1, GMX_DECIMALS)));
  }

  // const ethFloorPriceFund = expandDecimals(350 + 148 + 384, 18);
  // const glpFloorPriceFund = expandDecimals(660001, 18);
  // const usdcFloorPriceFund = expandDecimals(784598 + 200000, 30);
  // const ethFloorPriceFund = expandDecimals(350, 18);
  // const glpFloorPriceFund = expandDecimals(660, 18);
  // const usdcFloorPriceFund = expandDecimals(784 + 200, 30);

  // let totalFloorPriceFundUsd = 0;

  // if (glpPrice) {
    // const glpFloorPriceFundUsd = glpFloorPriceFund.mul(glpPrice).div(expandDecimals(1, 18));

    // totalFloorPriceFundUsd = glpFloorPriceFundUsd.add(usdcFloorPriceFund);
  // }

  let adjustedUsdgSupply = bigNumberify(0);

  for (let i = 0; i < tokenList.length; i++) {
    const token = tokenList[i];
    const tokenInfo = infoTokens[token.address];
    if (tokenInfo && tokenInfo.usdgAmount) {
      adjustedUsdgSupply = adjustedUsdgSupply.add(tokenInfo.usdgAmount);
    }
  }

  // const getWeightText = (tokenInfo) => {
  //   if (
  //     !tokenInfo.weight ||
  //     !tokenInfo.usdgAmount ||
  //     !adjustedUsdgSupply ||
  //     adjustedUsdgSupply.eq(0) ||
  //     !totalTokenWeights
  //   ) {
  //     return "...";
  //   }

  //   const currentWeightBps = tokenInfo.usdgAmount.mul(BASIS_POINTS_DIVISOR).div(adjustedUsdgSupply);
  //   // use add(1).div(10).mul(10) to round numbers up
  //   const targetWeightBps = tokenInfo.weight.mul(BASIS_POINTS_DIVISOR).div(totalTokenWeights).add(1).div(10).mul(10);

  //   const weightText = `${formatAmount(currentWeightBps, 2, 2, false)}% / ${formatAmount(
  //     targetWeightBps,
  //     2,
  //     2,
  //     false
  //   )}%`;

  //   return (
  //     <TooltipComponent
  //       handle={weightText}
  //       position="right-bottom"
  //       renderContent={() => {
  //         return (
  //           <>
  //             <StatsTooltipRow
  //               label={t`Current Weight`}
  //               value={`${formatAmount(currentWeightBps, 2, 2, false)}%`}
  //               showDollar={false}
  //             />
  //             <StatsTooltipRow
  //               label={t`Target Weight`}
  //               value={`${formatAmount(targetWeightBps, 2, 2, false)}%`}
  //               showDollar={false}
  //             />
  //             <br />
  //             {currentWeightBps.lt(targetWeightBps) && (
  //               <div className="text-white">
  //                 <Trans>
  //                   {tokenInfo.symbol} is below its target weight.
  //                   <br />
  //                   <br />
  //                   Get lower fees to{" "}
  //                   <Link to="/buy_blp" target="_blank" rel="noopener noreferrer">
  //                     buy BLP
  //                   </Link>{" "}
  //                   with {tokenInfo.symbol},&nbsp; and to{" "}
  //                   <Link to="/trade" target="_blank" rel="noopener noreferrer">
  //                     swap
  //                   </Link>{" "}
  //                   {tokenInfo.symbol} for other tokens.
  //                 </Trans>
  //               </div>
  //             )}
  //             {currentWeightBps.gt(targetWeightBps) && (
  //               <div className="text-white">
  //                 <Trans>
  //                   {tokenInfo.symbol} is above its target weight.
  //                   <br />
  //                   <br />
  //                   Get lower fees to{" "}
  //                   <Link to="/trade" target="_blank" rel="noopener noreferrer">
  //                     swap
  //                   </Link>{" "}
  //                   tokens for {tokenInfo.symbol}.
  //                 </Trans>
  //               </div>
  //             )}
  //             <br />
  //             <div>
  //               <ExternalLink href="https://bluespadexyz.gitbook.io/bluespade/">
  //                 <Trans>More Info</Trans>
  //               </ExternalLink>
  //             </div>
  //           </>
  //         );
  //       }}
  //     />
  //   );
  // };

  let stakedPercent = 0;

  if (totalGmxSupply && !totalGmxSupply.isZero() && !totalStakedGmx.isZero()) {
    stakedPercent = totalStakedGmx.mul(100).div(totalGmxSupply).toNumber();
  }

  let liquidityPercent = 0;

  if (totalGmxSupply && !totalGmxSupply.isZero() && totalGmxInLiquidity) {
    liquidityPercent = totalGmxInLiquidity.mul(100).div(totalGmxSupply).toNumber();
  }

  let notStakedPercent = 100 - stakedPercent - liquidityPercent;

  let gmxDistributionData = [
    {
      name: t`staked`,
      value: stakedPercent,
      color: "#4353fa",
    },
    {
      name: t`in liquidity`,
      value: liquidityPercent,
      color: "#0598fa",
    },
    {
      name: t`not staked`,
      value: notStakedPercent,
      color: "#5c0af5",
    },
  ];

  // const totalStatsStartDate = chainId === CRONOS ? t`05 Apr 2023` : t`01 Sep 2021`;

  let stableGlp = 0;
  let totalGlp = 0;

  let glpPool = tokenList.map((token) => {
    const tokenInfo = infoTokens[token.address];
    if (tokenInfo.usdgAmount && adjustedUsdgSupply && adjustedUsdgSupply.gt(0)) {
      const currentWeightBps = tokenInfo.usdgAmount.mul(BASIS_POINTS_DIVISOR).div(adjustedUsdgSupply);
      if (tokenInfo.isStable) {
        stableGlp += parseFloat(`${formatAmount(currentWeightBps, 2, 2, false)}`);
      }
      totalGlp += parseFloat(`${formatAmount(currentWeightBps, 2, 2, false)}`);
      return {
        fullname: token.name,
        name: token.symbol,
        value: parseFloat(`${formatAmount(currentWeightBps, 2, 2, false)}`),
      };
    }
    return null;
  });

  let stablePercentage = totalGlp > 0 ? ((stableGlp * 100) / totalGlp).toFixed(2) : "0.0";

  glpPool = glpPool.filter(function (element) {
    return element !== null;
  });

  glpPool = glpPool.sort(function (a, b) {
    if (a.value < b.value) return 1;
    else return -1;
  });

  gmxDistributionData = gmxDistributionData.sort(function (a, b) {
    if (a.value < b.value) return 1;
    else return -1;
  });

  const [gmxActiveIndex, setGMXActiveIndex] = useState(null);

  const onGMXDistributionChartEnter = (_, index) => {
    setGMXActiveIndex(index);
  };

  const onGMXDistributionChartLeave = (_, index) => {
    setGMXActiveIndex(null);
  };

  const [glpActiveIndex, setGLPActiveIndex] = useState(null);

  const onGLPPoolChartEnter = (_, index) => {
    setGLPActiveIndex(index);
  };

  const onGLPPoolChartLeave = (_, index) => {
    setGLPActiveIndex(null);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="stats-label">
          <div className="stats-label-color" style={{ backgroundColor: payload[0].color }}></div>
          {payload[0].value}% {payload[0].name}
        </div>
      );
    }

    return null;
  };

  return (
    <SEO title={getPageTitle("Dashboard")}>
      <div className="default-container DashboardV2 page-layout">
        <div className="hero-section">
          <div className="section-title-block">
            <div className="section-title-content">
              <div className="Page-title">
                <Trans>Stats</Trans>
                {chainId === CRONOS && <img src={cronos24Icon} alt="cronos24Icon" />}
                {chainId === POLYGON && <img src={polygon24Icon} alt="polygon24Icon" />}
                {chainId === SKALE && <img src={skale24Icon} alt="skale24Icon" />}
              </div>
            </div>
          </div>
        </div>
        <div className="DashboardV2-content">
          <div className="DashboardV2-cards">
            <div className="App-card">
              <div className="App-card-title">
                <Trans>Overview</Trans>
              </div>
              <div className="App-card-divider"></div>
              <div className="App-card-content">
                <div className="App-card-row">
                  <div className="label">
                    <Trans>AUM</Trans>
                  </div>
                  <div>
                    <TooltipComponent
                      handle={`$${formatAmount(tvl, USD_DECIMALS, 0, true)}`}
                      position="right-bottom"
                      renderContent={() => (
                        <span>{t`Assets Under Management: BLU staked (All chains) + BLP pool (${chainName})`}</span>
                      )}
                    />
                  </div>
                </div>
                <div className="App-card-row">
                  <div className="label">
                    <Trans>BLP Pool</Trans>
                  </div>
                  <div>
                    <TooltipComponent
                      handle={`$${formatAmount(aum, USD_DECIMALS, 0, true)}`}
                      position="right-bottom"
                      renderContent={() => <span>{t`Total value of tokens in BLP pool (${chainName})`}</span>}
                    />
                  </div>
                </div>
                <div className="App-card-row">
                  <div className="label">
                    <Trans>24h Volume</Trans>
                  </div>
                  <div>
                    <TooltipComponent
                      position="right-bottom"
                      className="nowrap"
                      handle={totalVolumeDelta ? `${formatNumber(totalVolumeDelta, { currency: true, compact: false })}` : `$0`}

                      renderContent={() => (
                        <StatsTooltip
                          title={t`Volume`}
                          cronosValue={totalVolumeDeltaCronos ? formatNumber(totalVolumeDeltaCronos, { currency: true, compact: false }) : `$0`}
                          polygonValue={totalVolumeDeltaPolygon ? formatNumber(totalVolumeDeltaPolygon, { currency: true, compact: false }) : `$0`}
                          skaleValue={totalVolumeDeltaSkale ? formatNumber(totalVolumeDeltaSkale, { currency: true, compact: false }) : `$0`}
                          total={totalVolumeDelta ? formatNumber(totalVolumeDelta, { currency: true, compact: false }) : `$0`}
                          isFloatNum={true}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="App-card-row">
                  <div className="label">
                    <Trans>Long Positions</Trans>
                  </div>
                  <div>
                    <TooltipComponent
                      position="right-bottom"
                      className="nowrap"
                      handle={`$${formatAmount(
                        totalLongPosition,
                        18,
                        0,
                        true
                      )}`}
                      renderContent={() => (
                        <StatsTooltip
                          title={t`Long Positions`}
                          cronosValue={ethers.BigNumber.from("0xE8D4A51000").mul(positionStatsInfoCronos.totalLongPositionSizes ? positionStatsInfoCronos.totalLongPositionSizes : bigNumberify(0))}
                          polygonValue={ethers.BigNumber.from("0xE8D4A51000").mul(positionStatsInfoPolygon.totalLongPositionSizes ? positionStatsInfoPolygon.totalLongPositionSizes : bigNumberify(0))}
                          skaleValue={ethers.BigNumber.from("0xE8D4A51000").mul(positionStatsInfoSkale.totalLongPositionSizes ? positionStatsInfoSkale.totalLongPositionSizes : bigNumberify(0))}
                          total={ethers.BigNumber.from("0xE8D4A51000").mul(totalLongPosition)}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="App-card-row">
                  <div className="label">
                    <Trans>Short Positions</Trans>
                  </div>
                  <div>
                    <TooltipComponent
                      position="right-bottom"
                      className="nowrap"
                      handle={`$${formatAmount(
                        totalShortPosition,
                        18,
                        0,
                        true
                      )}`}
                      renderContent={() => (
                        <StatsTooltip
                          title={t`Short Positions`}
                          cronosValue={ethers.BigNumber.from("0xE8D4A51000").mul(positionStatsInfoCronos.totalShortPositionSizes ? positionStatsInfoCronos.totalShortPositionSizes : bigNumberify(0))}
                          polygonValue={ethers.BigNumber.from("0xE8D4A51000").mul(positionStatsInfoPolygon.totalShortPositionSizes ? positionStatsInfoPolygon.totalShortPositionSizes : bigNumberify(0))}
                          skaleValue={ethers.BigNumber.from("0xE8D4A51000").mul(positionStatsInfoSkale.totalShortPositionSizes ? positionStatsInfoSkale.totalShortPositionSizes : bigNumberify(0))}
                          total={ethers.BigNumber.from("0xE8D4A51000").mul(totalShortPosition)}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="App-card">
              <div className="App-card-title">
                <Trans>Total Stats</Trans>
              </div>
              <div className="App-card-divider"></div>
              <div className="App-card-content">
                <div className="App-card-row">
                  <div className="label">
                    <Trans>Total Fees</Trans>
                  </div>
                  <div>
                    <TooltipComponent
                      position="right-bottom"
                      className="nowrap"
                      handle={totalFees ? `${formatNumber(totalFees, { currency: true, compact: false })}` : `$0`}
                      renderContent={() => (
                        <StatsTooltip
                          title={t`Total Fees`}
                          cronosValue={totalFeesCronos ? formatNumber(totalFeesCronos, { currency: true, compact: false }) : `$0`}
                          polygonValue={totalFeesPolygon ? formatNumber(totalFeesPolygon, { currency: true, compact: false }) : `$0`}
                          skaleValue={totalFeesSkale ? formatNumber(totalFeesSkale, { currency: true, compact: false }) : `$0`}
                          total={totalFees ? formatNumber(totalFees, { currency: true, compact: false }) : `$0`}
                          decimalsForConversion={0}
                          isFloatNum={true}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="App-card-row">
                  <div className="label">
                    <Trans>Total Volume</Trans>
                  </div>
                  <div>
                    <TooltipComponent
                      position="right-bottom"
                      className="nowrap"
                      handle={totalVolume ? `${formatNumber(totalVolume, { currency: true, compact: false })}` : `$0`}
                      renderContent={() => (
                        <StatsTooltip
                          title={t`Total Volume`}
                          cronosValue={totalVolumeCronos ? formatNumber(totalVolumeCronos, { currency: true, compact: false }) : `$0`}
                          polygonValue={totalVolumePolygon ? formatNumber(totalVolumePolygon, { currency: true, compact: false }) : `$0`}
                          skaleValue={totalVolumeSkale ? formatNumber(totalVolumeSkale, { currency: true, compact: false }) : `$0`}
                          total={totalVolume ? formatNumber(totalVolume, { currency: true, compact: false }) : `$0`}
                          isFloatNum={true}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="Tab-title-section">
            <div className="Page-title">
              <Trans>Tokens</Trans>
              {chainId === CRONOS && <img src={cronos24Icon} alt="cronos24Icon" />}
              {chainId === POLYGON && <img src={polygon24Icon} alt="polygon24Icon" />}
              {chainId === SKALE && <img src={skale24Icon} alt="skale24Icon" />}
              <div className="Page-description">
                <Trans>Platform and BLP index tokens.</Trans>
              </div>
            </div>
          </div>
          <div className="DashboardV2-token-cards">
            <div className="stats-wrapper stats-wrapper--gmx">
              <div className="App-card">
                <div className="App-card-title">
                  <div className="App-card-title-mark">
                    <div className="App-card-title-mark-icon">
                      <img src={gmx40Icon} alt="BLU Token Icon" />
                    </div>
                    <div>
                      <div className="App-card-title-mark-info">
                        <div className="App-card-title-mark-info">BLU</div>
                        <div className="App-card-drowdown-menu">
                          <AssetDropdown assetSymbol="GMX" />
                        </div>
                      </div>
                      <div className="App-card-title-mark-price">
                        {!gmxPrice && "..."}
                        {gmxPrice && (
                          `$${formatAmount(gmxPrice, USD_DECIMALS, 4, true)}`
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="App-card-divider"></div>
                <div className="App-card-content">
                  <div className="App-card-row">
                    <div className="label">
                      <Trans>Price</Trans>
                    </div>
                    <div>
                      {!gmxPrice && "..."}
                      {gmxPrice && (
                        <TooltipComponent
                          position="left-bottom"
                          className="nowrap"
                          handle={"$" + formatAmount(gmxPrice, USD_DECIMALS, 4, true)}
                          renderContent={() => (
                            <>
                              {/* <StatsTooltipRow
                                  label={t`on Cronos`}
                                  value={formatAmount(gmxPriceFromCronos, USD_DECIMALS, 4, true)}
                                  showDollar={true}
                                />
                                <StatsTooltipRow
                                  label={t`on Polygon`}
                                  value={formatAmount(gmxPriceFromPolygon, USD_DECIMALS, 4, true)}
                                  showDollar={true}
                                /> */}
                              <StatsTooltipRow
                                label={t`on Skale`}
                                value={formatAmount(gmxPriceFromSkale, USD_DECIMALS, 4, true)}
                                showDollar={true}
                              />
                            </>
                          )}
                        />
                      )}
                    </div>
                  </div>
                  <div className="App-card-row">
                    <div className="label">
                      <Trans>Supply</Trans>
                    </div>
                    <div>
                      <TooltipComponent
                        position="left-bottom"
                        className="nowrap"
                        handle={formatAmount(totalGmxSupply, GMX_DECIMALS, 0, true) + " BLU"}
                        renderContent={() => (
                          <StatsTooltip
                            // title={t`Staked`}
                            cronosValue={gmxSupplyCronos}
                            polygonValue={gmxSupplyPolygon}
                            skaleValue={gmxSupplySkale}
                            total={totalGmxSupply}
                            decimalsForConversion={GMX_DECIMALS}
                            showDollar={false}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="App-card-row">
                    <div className="label">
                      <Trans>Total Staked</Trans>
                    </div>
                    <div>
                      <TooltipComponent
                        position="left-bottom"
                        className="nowrap"
                        handle={`$${formatAmount(stakedGmxSupplyUsd, USD_DECIMALS, 0, true)}`}
                        renderContent={() => (
                          <StatsTooltip
                            // title={t`Staked`}
                            cronosValue={cronosStakedGmx}
                            polygonValue={polygonStakedGmx}
                            skaleValue={skaleStakedGmx}
                            total={totalStakedGmx}
                            decimalsForConversion={GMX_DECIMALS}
                            showDollar={false}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="App-card-row">
                    <div className="label">
                      <Trans>Market Cap</Trans>
                    </div>
                    <div>${formatAmount(gmxMarketCap, USD_DECIMALS, 0, true)}</div>
                  </div>
                </div>
                <div className="stats-piechart" onMouseLeave={onGMXDistributionChartLeave}>
                  {gmxDistributionData.length > 0 && (
                    <PieChart width={210} height={210}>
                      <Pie
                        data={gmxDistributionData}
                        cx={100}
                        cy={100}
                        innerRadius={73}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={2}
                        onMouseEnter={onGMXDistributionChartEnter}
                        onMouseOut={onGMXDistributionChartLeave}
                        onMouseLeave={onGMXDistributionChartLeave}
                      >
                        {gmxDistributionData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            style={{
                              filter:
                                gmxActiveIndex === index
                                  ? `drop-shadow(0px 0px 6px ${hexToRgba(entry.color, 0.7)})`
                                  : "none",
                              cursor: "pointer",
                            }}
                            stroke={entry.color}
                            strokeWidth={gmxActiveIndex === index ? 1 : 1}
                          />
                        ))}
                      </Pie>
                      <text x={"50%"} y={"50%"} fill="white" textAnchor="middle" dominantBaseline="middle">
                        <Trans>Distribution</Trans>
                      </text>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  )}
                </div>
              </div>
              <div className="App-card">
                <div className="App-card-title">
                  <div className="App-card-title-mark">
                    <div className="App-card-title-mark-icon">
                      <img src={glp40Icon} alt="glp40Icon" />
                      {chainId === CRONOS ? (
                        <img src={cronos16Icon} alt={t`Cronos Icon`} className="selected-network-symbol" />
                      ) : (
                        chainId === POLYGON ? (
                          <img src={polygon16Icon} alt={t`Polygon Icon`} className="selected-network-symbol" />
                        ) : (
                          <img src={skale16Icon} alt={t`Skale Icon`} className="selected-network-symbol" />
                        )
                      )}
                    </div>
                    <div>
                      <div className="App-card-title-mark-info">
                        <div className="App-card-title-mark-info">BLP</div>
                        <div className="App-card-drowdown-menu">
                          <AssetDropdown assetSymbol="GLP" />
                        </div>
                      </div>
                      <div className="App-card-title-mark-price">
                        {!gmxPrice && "..."}
                        {gmxPrice && (
                          `$${formatAmount(glpPrice, USD_DECIMALS, 3, true)}`
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="App-card-divider"></div>
                <div className="App-card-content">
                  <div className="App-card-row">
                    <div className="label">
                      <Trans>Price</Trans>
                    </div>
                    <div>${formatAmount(glpPrice, USD_DECIMALS, 3, true)}</div>
                  </div>
                  <div className="App-card-row">
                    <div className="label">
                      <Trans>Supply</Trans>
                    </div>
                    <div>{formatAmount(glpSupply, GLP_DECIMALS, 0, true)} BLP</div>
                  </div>
                  <div className="App-card-row">
                    <div className="label">
                      <Trans>Total Staked</Trans>
                    </div>
                    <div>${formatAmount(glpMarketCap, USD_DECIMALS, 0, true)}</div>
                  </div>
                  <div className="App-card-row">
                    <div className="label">
                      <Trans>Market Cap</Trans>
                    </div>
                    <div>${formatAmount(glpMarketCap, USD_DECIMALS, 0, true)}</div>
                  </div>
                  <div className="App-card-row">
                    <div className="label">
                      <Trans>Stablecoin</Trans>
                    </div>
                    <div>{stablePercentage}%</div>
                  </div>
                </div>
                <div className="stats-piechart" onMouseOut={onGLPPoolChartLeave}>
                  {glpPool.length > 0 && (
                    <PieChart width={210} height={210}>
                      <Pie
                        data={glpPool}
                        cx={100}
                        cy={100}
                        innerRadius={73}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        onMouseEnter={onGLPPoolChartEnter}
                        onMouseOut={onGLPPoolChartLeave}
                        onMouseLeave={onGLPPoolChartLeave}
                        paddingAngle={2}
                      >
                        {glpPool.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={GLP_POOL_COLORS[entry.name]}
                            style={{
                              filter:
                                glpActiveIndex === index
                                  ? `drop-shadow(0px 0px 6px ${hexToRgba(GLP_POOL_COLORS[entry.name], 0.7)})`
                                  : "none",
                              cursor: "pointer",
                            }}
                            stroke={GLP_POOL_COLORS[entry.name]}
                            strokeWidth={glpActiveIndex === index ? 1 : 1}
                          />
                        ))}
                      </Pie>
                      <text x={"50%"} y={"50%"} fill="white" textAnchor="middle" dominantBaseline="middle">
                        BLP Pool
                      </text>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  )}
                </div>
              </div>
            </div>
            {/* <div className="token-table-wrapper App-card">
              <div className="App-card-title">
                <Trans>Markets</Trans>{" "}
                {chainId === CRONOS && <img src={cronos16Icon} alt={t`Cronos Icon`} />}
                {chainId === POLYGON && <img src={polygon16Icon} alt={t`Polygon Icon`} />}
                {chainId === SKALE && <img src={skale16Icon} alt={t`Skale Icon`} />}
              </div>
              <div className="App-card-content">
                <table className="token-table">
                  <thead>
                    <tr>
                      <th>
                        <Trans>TOKEN</Trans>
                      </th>
                      <th>
                        <Trans>PRICE</Trans>
                      </th>
                      <th>
                        <Trans>POOL</Trans>
                      </th>
                      <th>
                        <Trans>UTILIZATION</Trans>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleTokens.map((token) => {
                      const tokenInfo = infoTokens[token.address];
                      let utilization = bigNumberify(0);
                      if (tokenInfo && tokenInfo.reservedAmount && tokenInfo.poolAmount && tokenInfo.poolAmount.gt(0)) {
                        utilization = tokenInfo.reservedAmount.mul(BASIS_POINTS_DIVISOR).div(tokenInfo.poolAmount);
                      }
                      let maxUsdgAmount = DEFAULT_MAX_USDG_AMOUNT;
                      if (tokenInfo.maxUsdgAmount && tokenInfo.maxUsdgAmount.gt(0)) {
                        maxUsdgAmount = tokenInfo.maxUsdgAmount;
                      }
                      const tokenImage = importImage("ic_" + token.symbol.toLowerCase() + "_40.svg");

                      return (
                        <tr key={token.symbol}>
                          <td>
                            <div className="token-symbol-wrapper">
                              <div className="App-card-title-info">
                                <div className="App-card-title-info-icon">
                                  <img src={tokenImage} alt={token.symbol} width="40px" />
                                </div>
                                <div className="App-card-title-info-text">
                                  <div className="App-card-info-title">{token.name}</div>
                                  <div className="App-card-info-subtitle">{token.symbol}</div>
                                </div>
                                <div>
                                  <AssetDropdown assetSymbol={token.symbol} assetInfo={token} />
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>${formatKeyAmount(tokenInfo, "minPrice", USD_DECIMALS, (token.symbol.includes("CRO") ||
                            token.symbol.includes("ATOM") ||
                            token.symbol.includes("ADA") ||
                            token.symbol.includes("DOGE") ||
                            token.symbol.includes("MATIC") ||
                            token.symbol.includes("LINK") ||
                            token.symbol.includes("AAVE") ||
                            token.symbol.includes("CRV") ||
                            token.symbol.includes("SKL")) ? 4 : 2, true)}
                          </td>
                          <td>
                            <TooltipComponent
                              handle={`$${formatKeyAmount(tokenInfo, "managedUsd", USD_DECIMALS, 0, true)}`}
                              position="right-bottom"
                              renderContent={() => {
                                return (
                                  <>
                                    <StatsTooltipRow
                                      label={t`Pool Amount`}
                                      value={`${formatKeyAmount(tokenInfo, "managedAmount", token.decimals, 0, true)} ${token.symbol
                                        }`}
                                      showDollar={false}
                                    />
                                    <StatsTooltipRow
                                      label={t`Target Min Amount`}
                                      value={`${formatKeyAmount(tokenInfo, "bufferAmount", token.decimals, 0, true)} ${token.symbol
                                        }`}
                                      showDollar={false}
                                    />
                                    <StatsTooltipRow
                                      label={t`Max ${tokenInfo.symbol} Capacity`}
                                      value={formatAmount(maxUsdgAmount, 18, 0, true)}
                                      showDollar={true}
                                    />
                                  </>
                                );
                              }}
                            />
                          </td>
                          <td>{formatAmount(utilization, 2, 2, false)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div> */}
            {/* <div className="token-grid">
              {visibleTokens.map((token) => {
                const tokenInfo = infoTokens[token.address];
                let utilization = bigNumberify(0);
                if (tokenInfo && tokenInfo.reservedAmount && tokenInfo.poolAmount && tokenInfo.poolAmount.gt(0)) {
                  utilization = tokenInfo.reservedAmount.mul(BASIS_POINTS_DIVISOR).div(tokenInfo.poolAmount);
                }
                let maxUsdgAmount = DEFAULT_MAX_USDG_AMOUNT;
                if (tokenInfo.maxUsdgAmount && tokenInfo.maxUsdgAmount.gt(0)) {
                  maxUsdgAmount = tokenInfo.maxUsdgAmount;
                }

                const tokenImage = importImage("ic_" + token.symbol.toLowerCase() + "_24.svg");
                return (
                  <div className="App-card" key={token.symbol}>
                    <div className="App-card-title">
                      <div className="mobile-token-card">
                        <img src={tokenImage} alt={token.symbol} width="20px" />
                        <div className="token-symbol-text">{token.symbol}</div>
                        <div>
                          <AssetDropdown assetSymbol={token.symbol} assetInfo={token} />
                        </div>
                      </div>
                    </div>
                    <div className="App-card-divider"></div>
                    <div className="App-card-content">
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Price</Trans>
                        </div>
                        <div>${formatKeyAmount(tokenInfo, "minPrice", USD_DECIMALS, (token.symbol.includes("CRO") ||
                          token.symbol.includes("ATOM") ||
                          token.symbol.includes("ADA") ||
                          token.symbol.includes("DOGE") ||
                          token.symbol.includes("MATIC") ||
                          token.symbol.includes("LINK") ||
                          token.symbol.includes("AAVE") ||
                          token.symbol.includes("CRV") ||
                          token.symbol.includes("SKL")) ? 4 : 2, true)}</div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Pool</Trans>
                        </div>
                        <div>
                          <TooltipComponent
                            handle={`$${formatKeyAmount(tokenInfo, "managedUsd", USD_DECIMALS, 0, true)}`}
                            position="right-bottom"
                            renderContent={() => {
                              return (
                                <>
                                  <StatsTooltipRow
                                    label={t`Pool Amount`}
                                    value={`${formatKeyAmount(tokenInfo, "managedAmount", token.decimals, 0, true)} ${token.symbol
                                      }`}
                                    showDollar={false}
                                  />
                                  <StatsTooltipRow
                                    label={t`Target Min Amount`}
                                    value={`${formatKeyAmount(tokenInfo, "bufferAmount", token.decimals, 0, true)} ${token.symbol
                                      }`}
                                    showDollar={false}
                                  />
                                  <StatsTooltipRow
                                    label={t`Max ${tokenInfo.symbol} Capacity`}
                                    value={formatAmount(maxUsdgAmount, 18, 0, true)}
                                  />
                                </>
                              );
                            }}
                          />
                        </div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Weight</Trans>
                        </div>
                        <div>{getWeightText(tokenInfo)}</div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Utilization</Trans>
                        </div>
                        <div>{formatAmount(utilization, 2, 2, false)}%</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div> */}
          </div>
        </div>
        <Footer />
      </div>
    </SEO>
  );
}
