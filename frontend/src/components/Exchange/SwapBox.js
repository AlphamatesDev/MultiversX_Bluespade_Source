import React, { useEffect, useMemo, useState } from "react";
import Tooltip from "../Tooltip/Tooltip";
import { select, t, Trans } from "@lingui/macro";
import Slider, { SliderTooltip } from "rc-slider";
import "rc-slider/assets/index.css";
import "./SwapBox.css";

import cx from "classnames";
import useSWR from "swr";
import { ethers } from "ethers";

// import { IoMdSwap } from "react-icons/io";
import { BsArrowRight } from "react-icons/bs";

import {
  adjustForDecimals,
  BASIS_POINTS_DIVISOR,
  calculatePositionDelta,
  DEFAULT_HIGHER_SLIPPAGE_AMOUNT,
  DUST_BNB,
  // getExchangeRate,
  // getExchangeRateDisplay,
  getLeverage,
  getLiquidationPrice,
  // getNextFromAmount,
  getNextToAmount,
  getPositionKey,
  isTriggerRatioInverted,
  LEVERAGE_ORDER_OPTIONS,
  LIMIT,
  LONG,
  MARGIN_FEE_BASIS_POINTS_NORMAL,
  MARGIN_FEE_BASIS_POINTS_SUPER,
  MARKET,
  PRECISION,
  SHORT,
  STOP,
  SWAP,
  SWAP_OPTIONS,
  // SWAP_ORDER_OPTIONS,
  USD_DECIMALS,
  USDG_ADDRESS,
  USDG_DECIMALS,
} from "lib/legacy";
import { SKALE, getChainName, getConstant, IS_NETWORK_DISABLED, isSupportedChain } from "config/chains";
import * as Api from "domain/legacy";
import { getContract } from "config/contracts";

// import Checkbox from "../Checkbox/Checkbox";
import Tab from "../Tab/Tab";
// import TokenSelector from "./TokenSelector";
import ExchangeInfoRow from "./ExchangeInfoRow";
import ConfirmationBox from "./ConfirmationBox";
import OrdersToa from "./OrdersToa";

import PositionRouter from "abis/PositionRouter.json";
// import Router from "abis/Router.json";
import Token from "abis/Token.json";
// import WETH from "abis/WETH.json";

import longImg from "img/long.svg";
import shortImg from "img/short.svg";
import swapImg from "img/swap.svg";

import { useUserReferralCode } from "domain/referrals";
import NoLiquidityErrorModal from "./NoLiquidityErrorModal";
import StatsTooltipRow from "../StatsTooltip/StatsTooltipRow";
import { callContract, contractFetcher } from "lib/contracts";
import {
  approveTokens,
  // getMostAbundantStableToken,
  shouldRaiseGasError,
} from "domain/tokens";
import { /*useLocalStorageByChainId,*/ useLocalStorageSerializeKey } from "lib/localStorage";
import { helperToast } from "lib/helperToast";
import { getTokenInfo, getUsd } from "domain/tokens/utils";
import { usePrevious } from "lib/usePrevious";
import { bigNumberify, expandDecimals, formatAmount, formatAmountFree, parseValue } from "lib/numbers";
import { getToken, getTokens, getWhitelistedTokens } from "config/tokens";
import ExternalLink from "components/ExternalLink/ExternalLink";

const SWAP_ICONS = {
  [LONG]: longImg,
  [SHORT]: shortImg,
  [SWAP]: swapImg,
};

const { AddressZero } = ethers.constants;

const leverageSliderHandle = (props) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <SliderTooltip
      prefixCls="rc-slider-tooltip"
      overlay={`${parseFloat(value).toFixed(2)}x`}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Slider.Handle value={value} {...restProps} />
    </SliderTooltip>
  );
};

const stopLossSliderHandle = (props) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <SliderTooltip
      prefixCls="rc-slider-tooltip"
      overlay={`${parseInt(value)}%`}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Slider.Handle value={value} {...restProps} />
    </SliderTooltip>
  );
};

const takeProfitSliderHandle = (props) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <SliderTooltip
      prefixCls="rc-slider-tooltip"
      overlay={`${parseInt(value)}%`}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Slider.Handle value={value} {...restProps} />
    </SliderTooltip>
  );
};

function getNextAveragePrice({ size, sizeDelta, hasProfit, delta, nextPrice, isLong }) {
  if (!size || !sizeDelta || !delta || !nextPrice) {
    return;
  }
  const nextSize = size.add(sizeDelta);
  let divisor;
  if (isLong) {
    divisor = hasProfit ? nextSize.add(delta) : nextSize.sub(delta);
  } else {
    divisor = hasProfit ? nextSize.sub(delta) : nextSize.add(delta);
  }
  if (!divisor || divisor.eq(0)) {
    return;
  }
  const nextAveragePrice = nextPrice.mul(nextSize).div(divisor);
  return nextAveragePrice;
}

export default function SwapBox(props) {
  const {
    pendingPositions,
    setPendingPositions,
    infoTokens,
    active,
    library,
    account,
    fromTokenAddress,
    // setFromTokenAddress,
    toTokenAddress,
    setToTokenAddress,
    swapOption,
    setSwapOption,
    positionsMap,
    pendingTxns,
    setPendingTxns,
    // tokenSelection,
    // setTokenSelection,
    setIsConfirming,
    isConfirming,
    isPendingConfirmation,
    setIsPendingConfirmation,
    flagOrdersEnabled,
    chainId,
    savedSlippageAmount,
    totalTokenWeights,
    usdgSupply,
    isSuperTrader,
    orders,
    savedIsPnlInLeverage,
    orderBookApproved,
    positionRouterApproved,
    isWaitingForPluginApproval,
    approveOrderBook,
    approvePositionRouter,
    setIsWaitingForPluginApproval,
    isWaitingForPositionRouterApproval,
    setIsWaitingForPositionRouterApproval,
    isPluginApproving,
    isPositionRouterApproving,
    savedShouldDisableValidationForTesting,
    minExecutionFee,
    minExecutionFeeUSD,
    minExecutionFeeErrorMessage,
  } = props;

  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [anchorOnFromAmount, setAnchorOnFromAmount] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [isWaitingForApproval, setIsWaitingForApproval] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [isHigherSlippageAllowed, setIsHigherSlippageAllowed] = useState(false);
  const { attachedOnChain, userReferralCode } = useUserReferralCode(library, chainId, account);

  let allowedSlippage = savedSlippageAmount;
  if (isHigherSlippageAllowed) {
    allowedSlippage = DEFAULT_HIGHER_SLIPPAGE_AMOUNT;
  }

  // const defaultCollateralSymbol = getConstant(chainId, "defaultCollateralSymbol");
  const isLong = swapOption === LONG;
  const isShort = swapOption === SHORT;

  // const getLeaderboardLink = () => {
  //   if (chainId === SKALE) {
  //     return "https://www.gmx.house/skale/leaderboard";
  //   }
  //   return "https://www.gmx.house";
  // };

  // function getTokenLabel() {
  //   switch (true) {
  //     case isLong:
  //       return t`Long`;
  //     case isShort:
  //       return t`Short`;
  //     default:
  //       return "";
  //   }
  // }

  const [leverageOption, setLeverageOption] = useLocalStorageSerializeKey(
    [chainId, "Exchange-swap-leverage-option"],
    "2"
  );

  const [stopLossOption, setStopLossOption] = useLocalStorageSerializeKey(
    [chainId, "Exchange-swap-stoploss-option"],
    "2"
  );

  const [takeProfitOption, setTakeProfitOption] = useLocalStorageSerializeKey(
    [chainId, "Exchange-swap-takeprofit-option"],
    "2"
  );

  const hasLeverageOption = !isNaN(parseFloat(leverageOption));

  const [ordersToaOpen, setOrdersToaOpen] = useState(false);

  let [orderOption, setOrderOption] = useLocalStorageSerializeKey([chainId, "Order-option"], MARKET);
  if (!flagOrdersEnabled) {
    orderOption = MARKET;
  }

  const onOrderOptionChange = (option) => {
    setOrderOption(option);
  };

  const isMarketOrder = orderOption === MARKET;
  const orderOptions = LEVERAGE_ORDER_OPTIONS;
  const orderOptionLabels = { [STOP]: t`Trigger`, [MARKET]: t`Market`/* , [LIMIT]: t`Limit` */ };

  const [triggerPriceValue, setTriggerPriceValue] = useState("");
  const triggerPriceUsd = isMarketOrder ? 0 : parseValue(triggerPriceValue, USD_DECIMALS);

  const onTriggerPriceChange = (evt) => {
    setTriggerPriceValue(evt.target.value || "");
  };

  const onLeverageChange = (evt) => {
    if (evt.target.value === "")
      setLeverageOption("");
    else if (parseInt(evt.target.value) <= 1250)
      setLeverageOption(evt.target.value || "");
  }

  // const onTriggerRatioChange = (evt) => {
  //   setTriggerRatioValue(evt.target.value || "");
  // };

  const positionKey = getPositionKey(account, fromTokenAddress, toTokenAddress, isLong);

  const existingPosition = positionKey ? positionsMap[positionKey] : undefined;
  const hasExistingPosition = existingPosition && existingPosition.size && existingPosition.size.gt(0);

  const whitelistedTokens = getWhitelistedTokens(chainId);
  const tokens = getTokens(chainId);
  const fromTokens = tokens.filter((token) => token.isCollateralToken);
  const stableTokens = tokens.filter((token) => token.isStable);
  const toTokens = whitelistedTokens.filter((token) => !token.isStable);

  const needOrderBookApproval = !isMarketOrder && !orderBookApproved;
  const prevNeedOrderBookApproval = usePrevious(needOrderBookApproval);

  const needPositionRouterApproval = (isLong || isShort) && isMarketOrder && !positionRouterApproved;
  const prevNeedPositionRouterApproval = usePrevious(needPositionRouterApproval);

  useEffect(() => {
    if (!needOrderBookApproval && prevNeedOrderBookApproval && isWaitingForPluginApproval) {
      setIsWaitingForPluginApproval(false);
      helperToast.success(<div>Orders enabled!</div>);
    }
  }, [needOrderBookApproval, prevNeedOrderBookApproval, setIsWaitingForPluginApproval, isWaitingForPluginApproval]);

  useEffect(() => {
    if (!needPositionRouterApproval && prevNeedPositionRouterApproval && isWaitingForPositionRouterApproval) {
      setIsWaitingForPositionRouterApproval(false);
      helperToast.success(<div>Leverage enabled!</div>);
    }
  }, [
    needPositionRouterApproval,
    prevNeedPositionRouterApproval,
    setIsWaitingForPositionRouterApproval,
    isWaitingForPositionRouterApproval,
  ]);

  useEffect(() => {
    if (!needOrderBookApproval && prevNeedOrderBookApproval && isWaitingForPluginApproval) {
      setIsWaitingForPluginApproval(false);
      helperToast.success(<div>Orders enabled!</div>);
    }
  }, [needOrderBookApproval, prevNeedOrderBookApproval, setIsWaitingForPluginApproval, isWaitingForPluginApproval]);

  const routerAddress = getContract(chainId, "Router");
  const tokenAllowanceAddress = fromTokenAddress;
  const { data: tokenAllowance } = useSWR(
    active && [active, chainId, tokenAllowanceAddress, "allowance", account, routerAddress],
    {
      fetcher: contractFetcher(library, Token),
    }
  );

  const { data: hasOutdatedUi } = Api.useHasOutdatedUi();

  const fromToken = getToken(chainId, fromTokenAddress);
  const toToken = getToken(chainId, toTokenAddress);

  const fromTokenInfo = getTokenInfo(infoTokens, fromTokenAddress);
  const toTokenInfo = getTokenInfo(infoTokens, toTokenAddress);

  const renderAvailableLiquidity = () => {
    return (
      <div className="Exchange-info-row">
        <div className="Exchange-info-label">
          <Trans>Available Liquidity</Trans>
        </div>
        <div className="align-right">
          <Tooltip
            handle={`$${formatAmount(fromTokenInfo.maxAvailableLong, USD_DECIMALS, 0, true)}`}
            position="right-bottom"
            renderContent={() => {
              return (
                <>
                  <StatsTooltipRow
                    label={t`Max ${fromTokenInfo.symbol} long capacity`}
                    value={formatAmount(fromTokenInfo.maxLongCapacity, USD_DECIMALS, 0, true)}
                  />
                  <StatsTooltipRow
                    label={t`Current ${fromTokenInfo.symbol} long`}
                    value={formatAmount(fromTokenInfo.guaranteedUsd, USD_DECIMALS, 0, true)}
                  />
                </>
              );
            }}
          ></Tooltip>
        </div>
      </div>
    );
  };

  const fromBalance = fromTokenInfo ? fromTokenInfo.balance : bigNumberify(0);
  // const toBalance = toTokenInfo ? toTokenInfo.balance : bigNumberify(0);

  const fromAmount = parseValue(fromValue, fromToken && fromToken.decimals);
  const toAmount = parseValue(toValue, fromToken && fromToken.decimals);

  const needApproval =
    tokenAllowance &&
    fromAmount &&
    fromAmount.gt(tokenAllowance);
  const prevFromTokenAddress = usePrevious(fromTokenAddress);
  const prevNeedApproval = usePrevious(needApproval);
  const prevToTokenAddress = usePrevious(toTokenAddress);

  const fromUsdMin = getUsd(fromAmount, fromTokenAddress, false, infoTokens);
  const toUsdMax = getUsd(toAmount, fromTokenAddress, true, infoTokens, orderOption, fromToken.maxPrice/*triggerPriceUsd*/);
  const collateralTokenAddress = fromTokenAddress;
  const collateralToken = getToken(chainId, collateralTokenAddress);
  // const collateralTokens = tokens.filter((token) => token.isCollateralToken);

  const [triggerRatioValue, setTriggerRatioValue] = useState("");

  const triggerRatioInverted = useMemo(() => {
    return isTriggerRatioInverted(fromTokenInfo, toTokenInfo);
  }, [toTokenInfo, fromTokenInfo]);

  // const maxToTokenOut = useMemo(() => {
  //   const value = toTokenInfo.availableAmount?.gt(toTokenInfo.poolAmount?.sub(toTokenInfo.bufferAmount))
  //     ? toTokenInfo.poolAmount?.sub(toTokenInfo.bufferAmount)
  //     : toTokenInfo.availableAmount;

  //   if (!value) {
  //     return bigNumberify(0);
  //   }

  //   return value.gt(0) ? value : bigNumberify(0);
  // }, [toTokenInfo]);

  // const maxToTokenOutUSD = useMemo(() => {
  //   return getUsd(maxToTokenOut, toTokenAddress, false, infoTokens);
  // }, [maxToTokenOut, toTokenAddress, infoTokens]);

  // const maxFromTokenInUSD = useMemo(() => {
  //   const value = fromTokenInfo.maxUsdgAmount
  //     ?.sub(fromTokenInfo.usdgAmount)
  //     .mul(expandDecimals(1, USD_DECIMALS))
  //     .div(expandDecimals(1, USDG_DECIMALS));

  //   if (!value) {
  //     return bigNumberify(0);
  //   }

  //   return value.gt(0) ? value : bigNumberify(0);
  // }, [fromTokenInfo]);

  // const maxFromTokenIn = useMemo(() => {
  //   if (!fromTokenInfo.maxPrice) {
  //     return bigNumberify(0);
  //   }
  //   return maxFromTokenInUSD?.mul(expandDecimals(1, fromTokenInfo.decimals)).div(fromTokenInfo.maxPrice).toString();
  // }, [maxFromTokenInUSD, fromTokenInfo]);

  // let maxSwapAmountUsd = bigNumberify(0);

  // if (maxToTokenOutUSD && maxFromTokenInUSD) {
  //   maxSwapAmountUsd = maxToTokenOutUSD.lt(maxFromTokenInUSD) ? maxToTokenOutUSD : maxFromTokenInUSD;
  // }

  const triggerRatio = useMemo(() => {
    if (!triggerRatioValue) {
      return bigNumberify(0);
    }
    let ratio = parseValue(triggerRatioValue, USD_DECIMALS);
    if (ratio.eq(0)) {
      return bigNumberify(0);
    }
    if (triggerRatioInverted) {
      ratio = PRECISION.mul(PRECISION).div(ratio);
    }
    return ratio;
  }, [triggerRatioValue, triggerRatioInverted]);

  useEffect(() => {
    if (
      fromToken &&
      fromTokenAddress === prevFromTokenAddress &&
      !needApproval &&
      prevNeedApproval &&
      isWaitingForApproval
    ) {
      setIsWaitingForApproval(false);
      helperToast.success(<div>{fromToken.symbol} approved!</div>);
    }
  }, [
    fromTokenAddress,
    prevFromTokenAddress,
    needApproval,
    prevNeedApproval,
    setIsWaitingForApproval,
    fromToken.symbol,
    isWaitingForApproval,
    fromToken,
  ]);

  useEffect(() => {
    if (!toTokens.find((token) => token.address === toTokenAddress)) {
      setToTokenAddress(swapOption, toTokens[0].address);
    }
  }, [swapOption, toTokens, toTokenAddress, setToTokenAddress]);

  useEffect(() => {
    if (swapOption !== SHORT) {
      return;
    }
    if (toTokenAddress === prevToTokenAddress) {
      return;
    }
  }, [
    account,
    toTokenAddress,
    prevToTokenAddress,
    swapOption,
    positionsMap,
    stableTokens,
  ]);

  useEffect(() => {
    const updateLeverageAmounts = () => {
      if (!hasLeverageOption) {
        return;
      }

      if (anchorOnFromAmount) {
        if (!fromAmount) {
          setToValue("");
          return;
        }

        const fromTokenInfo = getTokenInfo(infoTokens, fromTokenAddress);

        if (fromTokenInfo && fromTokenInfo.maxPrice && fromUsdMin && fromUsdMin.gt(0)) {
          const leverageMultiplier = parseInt(leverageOption * BASIS_POINTS_DIVISOR);
          // const fromTokenPriceUsd = !isMarketOrder && triggerPriceUsd && triggerPriceUsd.gt(0) ? triggerPriceUsd : fromTokenInfo.maxPrice;
          const fromTokenPriceUsd = fromTokenInfo.maxPrice;

          const toNumerator = fromUsdMin.mul(leverageMultiplier).mul(BASIS_POINTS_DIVISOR);
          const toDenominator = bigNumberify(isSuperTrader ? MARGIN_FEE_BASIS_POINTS_SUPER : MARGIN_FEE_BASIS_POINTS_NORMAL).mul(leverageMultiplier).add(bigNumberify(BASIS_POINTS_DIVISOR).mul(BASIS_POINTS_DIVISOR));

          const nextToUsd = toNumerator.div(toDenominator);

          const nextToAmount = nextToUsd.mul(expandDecimals(1, fromToken.decimals)).div(fromTokenPriceUsd);

          const nextToValue = formatAmountFree(nextToAmount, fromToken.decimals, fromToken.decimals);

          setToValue(nextToValue);
        }
        return;
      }

      if (!toAmount) {
        setFromValue("");
        return;
      }

      if (fromTokenInfo && fromTokenInfo.minPrice && toUsdMax && toUsdMax.gt(0)) {
        const leverageMultiplier = parseInt(leverageOption * BASIS_POINTS_DIVISOR);

        const baseFromAmountUsd = toUsdMax.mul(BASIS_POINTS_DIVISOR).div(leverageMultiplier);

        let fees = toUsdMax.mul(isSuperTrader ? MARGIN_FEE_BASIS_POINTS_SUPER : MARGIN_FEE_BASIS_POINTS_NORMAL).div(BASIS_POINTS_DIVISOR);

        const nextFromUsd = baseFromAmountUsd.add(fees);

        const nextFromAmount = nextFromUsd.mul(expandDecimals(1, fromToken.decimals)).div(fromTokenInfo.minPrice);

        const nextFromValue = formatAmountFree(nextFromAmount, fromToken.decimals, fromToken.decimals);

        setFromValue(nextFromValue);
      }
    };

    if (isLong || isShort) {
      updateLeverageAmounts();
    }
  }, [
    anchorOnFromAmount,
    fromAmount,
    toAmount,
    fromToken,
    toToken,
    fromTokenAddress,
    toTokenAddress,
    infoTokens,
    isLong,
    isShort,
    leverageOption,
    fromUsdMin,
    toUsdMax,
    isMarketOrder,
    triggerPriceUsd,
    triggerRatio,
    hasLeverageOption,
    usdgSupply,
    totalTokenWeights,
    chainId,
    collateralTokenAddress,
    toTokenAddress,
    fromTokenInfo,
    isSuperTrader
  ]);

  let entryMarkPrice;
  let exitMarkPrice;
  if (toTokenInfo) {
    entryMarkPrice = swapOption === LONG ? toTokenInfo.maxPrice : toTokenInfo.minPrice;
    exitMarkPrice = swapOption === LONG ? toTokenInfo.minPrice : toTokenInfo.maxPrice;
  }

  let leverage = bigNumberify(0);
  if (fromUsdMin && toUsdMax && fromUsdMin.gt(0)) {
    const fees = toUsdMax.mul(isSuperTrader ? MARGIN_FEE_BASIS_POINTS_SUPER : MARGIN_FEE_BASIS_POINTS_NORMAL).div(BASIS_POINTS_DIVISOR);
    if (fromUsdMin.sub(fees).gt(0)) {
      leverage = toUsdMax.mul(BASIS_POINTS_DIVISOR).div(fromUsdMin.sub(fees));
    }
  }

  let nextAveragePrice = isMarketOrder ? entryMarkPrice : triggerPriceUsd;
  if (hasExistingPosition) {
    let nextDelta, nextHasProfit;

    if (isMarketOrder) {
      nextDelta = existingPosition.delta;
      nextHasProfit = existingPosition.hasProfit;
    } else {
      const data = calculatePositionDelta(triggerPriceUsd || bigNumberify(0), existingPosition);
      nextDelta = data.delta;
      nextHasProfit = data.hasProfit;
    }

    nextAveragePrice = getNextAveragePrice({
      size: existingPosition.size,
      sizeDelta: toUsdMax,
      hasProfit: nextHasProfit,
      delta: nextDelta,
      nextPrice: isMarketOrder ? entryMarkPrice : triggerPriceUsd,
      isLong,
    });
  }

  const liquidationPrice = getLiquidationPrice({
    isLong,
    size: hasExistingPosition ? existingPosition.size : bigNumberify(0),
    collateral: hasExistingPosition ? existingPosition.collateral : bigNumberify(0),
    averagePrice: nextAveragePrice,
    entryFundingRate: hasExistingPosition ? existingPosition.entryFundingRate : bigNumberify(0),
    cumulativeFundingRate: hasExistingPosition ? existingPosition.cumulativeFundingRate : bigNumberify(0),
    sizeDelta: toUsdMax,
    collateralDelta: fromUsdMin,
    increaseCollateral: true,
    increaseSize: true,
    isSuperTrader: isSuperTrader
  });

  const existingLiquidationPrice = existingPosition ? getLiquidationPrice(existingPosition) : undefined;
  let displayLiquidationPrice = liquidationPrice ? liquidationPrice : existingLiquidationPrice;

  if (hasExistingPosition) {
    const collateralDelta = fromUsdMin ? fromUsdMin : bigNumberify(0);
    const sizeDelta = toUsdMax ? toUsdMax : bigNumberify(0);
    leverage = getLeverage({
      size: existingPosition.size,
      sizeDelta,
      collateral: existingPosition.collateral,
      collateralDelta,
      increaseCollateral: true,
      entryFundingRate: existingPosition.entryFundingRate,
      cumulativeFundingRate: existingPosition.cumulativeFundingRate,
      increaseSize: true,
      hasProfit: existingPosition.hasProfit,
      delta: existingPosition.delta,
      includeDelta: savedIsPnlInLeverage,
      isSuperTrader: isSuperTrader
    });
  } else if (hasLeverageOption) {
    leverage = bigNumberify(parseInt(leverageOption * BASIS_POINTS_DIVISOR));
  }

  const getLeverageError = () => {
    if (IS_NETWORK_DISABLED[chainId]) {
      return [t`Leverage disabled, pending ${getChainName(chainId)} upgrade`];
    }
    if (hasOutdatedUi) {
      return [t`Page outdated, please refresh`];
    }

    if (!toAmount || toAmount.eq(0)) {
      return [t`Enter an amount`];
    }

    let toTokenInfo = getTokenInfo(infoTokens, toTokenAddress);
    if (toTokenInfo && toTokenInfo.isStable) {
      return [t`${select(swapOption, { [LONG]: "Longing", [SHORT]: "Shorting" })} ${toTokenInfo.symbol} not supported`];
    }

    const fromTokenInfo = getTokenInfo(infoTokens, fromTokenAddress);
    if (
      !savedShouldDisableValidationForTesting &&
      fromTokenInfo &&
      fromTokenInfo.balance &&
      fromAmount &&
      fromAmount.gt(fromTokenInfo.balance)
    ) {
      return [t`Insufficient ${fromTokenInfo.symbol} balance`];
    }

    if (leverage && leverage.eq(0)) {
      return [t`Enter an amount`];
    }
    if (!isMarketOrder && (!triggerPriceValue || triggerPriceUsd.eq(0))) {
      return [t`Enter a price`];
    }

    if (!hasExistingPosition && fromUsdMin && fromUsdMin.lt(expandDecimals(10, USD_DECIMALS))) {
      return [t`Min order: 10 USD`];
    }

    if (leverage && leverage.lt(1.1 * BASIS_POINTS_DIVISOR)) {
      return [t`Min leverage: 1.1x`];
    }

    if (leverage && leverage.gt(1250 * BASIS_POINTS_DIVISOR)) {
      return [t`Max leverage: 1250x`];
    }

    if (!isMarketOrder && entryMarkPrice && triggerPriceUsd && !savedShouldDisableValidationForTesting) {
      if (isLong && entryMarkPrice.lt(triggerPriceUsd)) {
        return [t`Price above Mark Price`];
      }
      if (!isLong && entryMarkPrice.gt(triggerPriceUsd)) {
        return [t`Price below Mark Price`];
      }
    }

    let requiredAmount = toAmount;

    if (fromTokenAddress !== toTokenAddress) {
      if (toToken && toTokenAddress !== USDG_ADDRESS) {
        if (!fromTokenInfo.availableAmount) {
          return [t`Liquidity data not loaded`];
        }
        if (fromTokenInfo.availableAmount && requiredAmount.gt(fromTokenInfo.availableAmount)) {
          return [t`Insufficient liquidity`];
        }
      }

      if (
        toTokenInfo.poolAmount &&
        toTokenInfo.bufferAmount &&
        toTokenInfo.bufferAmount.gt(toTokenInfo.poolAmount)
      ) {
        return [t`Insufficient liquidity`, true, "BUFFER"];
      }

      if (
        fromUsdMin &&
        fromTokenInfo.maxUsdgAmount &&
        fromTokenInfo.maxUsdgAmount.gt(0) &&
        fromTokenInfo.minPrice &&
        fromTokenInfo.usdgAmount
      ) {
        const usdgFromAmount = adjustForDecimals(fromUsdMin, USD_DECIMALS, USDG_DECIMALS);
        const nextUsdgAmount = fromTokenInfo.usdgAmount.add(usdgFromAmount);
        if (nextUsdgAmount.gt(fromTokenInfo.maxUsdgAmount)) {
          return [t`${fromTokenInfo.symbol} pool exceeded, try different token`, true, "MAX_USDG"];
        }
      }
    }

    if (toTokenInfo && toTokenInfo.maxPrice) {
      const sizeUsd = toAmount.mul(toTokenInfo.maxPrice).div(expandDecimals(1, toTokenInfo.decimals));
      if (
        toTokenInfo.maxGlobalLongSize &&
        toTokenInfo.maxGlobalLongSize.gt(0) &&
        toTokenInfo.maxAvailableLong &&
        sizeUsd.gt(toTokenInfo.maxAvailableLong)
      ) {
        return [t`Max ${toTokenInfo.symbol} long exceeded`];
      }
    }

    return [false];
  };

  const getToLabel = () => {
    if (isLong) {
      return t`Long`;
    }
    return t`Short`;
  };

  const getError = () => {
    return getLeverageError();
  };

  const renderOrdersToa = () => {
    if (!ordersToaOpen) {
      return null;
    }

    return (
      <OrdersToa
        setIsVisible={setOrdersToaOpen}
        approveOrderBook={approveOrderBook}
        isPluginApproving={isPluginApproving}
      />
    );
  };

  const isPrimaryEnabled = () => {
    if (IS_NETWORK_DISABLED[chainId]) {
      return false;
    }
    if (isStopOrder) {
      return true;
    }
    if (!active) {
      return true;
    }
    const [error, modal] = getError();
    if (error && !modal) {
      return false;
    }
    if (needOrderBookApproval && isWaitingForPluginApproval) {
      return false;
    }
    if ((needApproval && isWaitingForApproval) || isApproving) {
      return false;
    }
    if (needPositionRouterApproval && isWaitingForPositionRouterApproval) {
      return false;
    }
    if (isPositionRouterApproving) {
      return false;
    }
    if (isApproving) {
      return false;
    }
    if (isSubmitting) {
      return false;
    }

    return true;
  };

  const getPrimaryText = () => {
    if (isStopOrder) {
      return t`Open a position`;
    }
    if (!active) {
      return t`Connect Wallet`;
    }
    if (!isSupportedChain(chainId)) {
      return t`Incorrect Network`;
    }
    const [error, modal] = getError();
    if (error && !modal) {
      return error;
    }

    if (needPositionRouterApproval && isWaitingForPositionRouterApproval) {
      return t`Enabling Leverage...`;
    }
    if (isPositionRouterApproving) {
      return t`Enabling Leverage...`;
    }
    if (needPositionRouterApproval) {
      return t`Enable Leverage`;
    }

    if (needApproval && isWaitingForApproval) {
      return t`Waiting for Approval`;
    }
    if (isApproving) {
      return t`Approving ${fromToken.symbol}...`;
    }
    if (needApproval) {
      return t`Approve ${fromToken.symbol}`;
    }

    if (needOrderBookApproval && isWaitingForPluginApproval) {
      return t`Enabling Orders...`;
    }
    if (isPluginApproving) {
      return t`Enabling Orders...`;
    }
    if (needOrderBookApproval) {
      return t`Enable Orders`;
    }

    if (!isMarketOrder) return t`Create ${orderOption.charAt(0) + orderOption.substring(1).toLowerCase()} Order`;

    if (isLong) {
      const indexTokenInfo = getTokenInfo(infoTokens, toTokenAddress);
      if (indexTokenInfo && indexTokenInfo.minPrice) {
        const { amount: nextToAmount } = getNextToAmount(
          chainId,
          fromAmount,
          fromTokenAddress,
          toTokenAddress,
          infoTokens,
          undefined,
          undefined,
          usdgSupply,
          totalTokenWeights,
          false
        );
        const nextToAmountUsd = nextToAmount
          .mul(indexTokenInfo.minPrice)
          .div(expandDecimals(1, indexTokenInfo.decimals));
        if (fromTokenAddress === USDG_ADDRESS && nextToAmountUsd.lt(fromUsdMin.mul(98).div(100))) {
          return t`High USDG Slippage, Long Anyway`;
        }
      }
      return t`Long ${toToken.symbol}`;
    }

    return t`Short ${toToken.symbol}`;
  };

  // const onSelectToToken = (token) => {
  //   setToTokenAddress(swapOption, token.address);
  // };

  const onFromValueChange = (e) => {
    setAnchorOnFromAmount(true);
    setFromValue(e.target.value);
  };

  const onToValueChange = (e) => {
    setAnchorOnFromAmount(false);
    setToValue(e.target.value);
  };

  // const switchTokens = () => {
  //   if (fromAmount && toAmount) {
  //     if (anchorOnFromAmount) {
  //       setToValue(formatAmountFree(fromAmount, fromToken.decimals, 8));
  //     } else {
  //       setFromValue(formatAmountFree(toAmount, toToken.decimals, 8));
  //     }
  //     setAnchorOnFromAmount(!anchorOnFromAmount);
  //   }
  //   setIsWaitingForApproval(false);

  //   const updatedTokenSelection = JSON.parse(JSON.stringify(tokenSelection));
  //   updatedTokenSelection[swapOption] = {
  //     from: toTokenAddress,
  //     to: fromTokenAddress,
  //   };
  //   setTokenSelection(updatedTokenSelection);
  // };

  const createIncreaseOrder = () => {
    const minOut = 0;
    const indexToken = getToken(chainId, toTokenAddress);
    const successMsg = t`
      Created limit order for ${indexToken.symbol} ${isLong ? "Long" : "Short"}: ${formatAmount(
      toUsdMax,
      USD_DECIMALS,
      2
    )} USD!
    `;
    return Api.createIncreaseOrder(
      chainId,
      library,
      fromAmount,
      toTokenAddress,
      minOut,
      toUsdMax,
      collateralTokenAddress,
      isLong,
      triggerPriceUsd,
      stopLossOption,
      takeProfitOption,
      {
        pendingTxns,
        setPendingTxns,
        sentMsg: t`Limit order submitted!`,
        successMsg,
        failMsg: t`Limit order creation failed.`,
      }
    )
      .then(() => {
        setIsConfirming(false);
      })
      .finally(() => {
        setIsSubmitting(false);
        setIsPendingConfirmation(false);
      });
  };

  let referralCode = ethers.constants.HashZero;
  if (!attachedOnChain && userReferralCode) {
    referralCode = userReferralCode;
  }

  const increasePosition = async () => {
    setIsSubmitting(true);

    const refPrice = isLong ? toTokenInfo.maxPrice : toTokenInfo.minPrice;
    const priceBasisPoints = isLong ? BASIS_POINTS_DIVISOR + allowedSlippage : BASIS_POINTS_DIVISOR - allowedSlippage;
    const priceLimit = refPrice.mul(priceBasisPoints).div(BASIS_POINTS_DIVISOR);

    const boundedFromAmount = fromAmount ? fromAmount : bigNumberify(0);

    if (fromAmount && fromAmount.gt(0) && fromTokenAddress === USDG_ADDRESS && isLong) {
      const { amount: nextToAmount/*, path: multiPath */ } = getNextToAmount(
        chainId,
        fromAmount,
        fromTokenAddress,
        toTokenAddress,
        infoTokens,
        undefined,
        undefined,
        usdgSupply,
        totalTokenWeights,
        false
      );
      if (nextToAmount.eq(0)) {
        helperToast.error(t`Insufficient liquidity`);
        return;
      }
    }

    let params = [[
      fromTokenAddress, // _collateralToken
      toTokenAddress, // _indexToken
      0, // _minOut
      toUsdMax, // _sizeDelta
      isLong, // _isLong
      priceLimit, // _acceptablePrice
      stopLossOption, // _slPercent
      takeProfitOption, // _tpPercent
      // minExecutionFee, // _executionFee
      referralCode, // _referralCode
      AddressZero // _callbackTarget
    ],
      boundedFromAmount, // _amountIn
    ];

    let method = "createIncreasePosition";
    let value = 0;

    if (shouldRaiseGasError(getTokenInfo(infoTokens, fromTokenAddress), fromAmount)) {
      setIsSubmitting(false);
      setIsPendingConfirmation(false);
      helperToast.error(
        t`Leave at least ${formatAmount(DUST_BNB, 18, 3)} ${getConstant(chainId, "nativeTokenSymbol")} for gas`
      );
      return;
    }

    const contractAddress = getContract(chainId, "PositionRouter");
    const contract = new ethers.Contract(contractAddress, PositionRouter.abi, library.getSigner());
    const indexToken = getTokenInfo(infoTokens, toTokenAddress);
    const tokenSymbol = indexToken.symbol;
    const longOrShortText = isLong ? t`Long` : t`Short`;
    const successMsg = t`Requested increase of ${tokenSymbol} ${longOrShortText} by ${formatAmount(
      toUsdMax,
      USD_DECIMALS,
      2
    )} USD.`;

    callContract(chainId, contract, method, params, {
      value,
      setPendingTxns,
      sentMsg: `${longOrShortText} submitted.`,
      failMsg: `${longOrShortText} failed.`,
      successMsg,
      // for Skale, sometimes the successMsg shows after the position has already been executed
      // hide the success message for Skale as a workaround
      hideSuccessMsg: chainId === SKALE,
    })
      .then(async () => {
        setIsConfirming(false);

        const key = getPositionKey(account, fromTokenAddress, toTokenAddress, isLong);
        let nextSize = toUsdMax;
        if (hasExistingPosition) {
          nextSize = existingPosition.size.add(toUsdMax);
        }

        pendingPositions[key] = {
          updatedAt: Date.now(),
          pendingChanges: {
            size: nextSize,
          },
        };

        setPendingPositions({ ...pendingPositions });
      })
      .finally(() => {
        setIsSubmitting(false);
        setIsPendingConfirmation(false);
      });
  };

  const onSwapOptionChange = (opt) => {
    setSwapOption(opt);
    if (orderOption === STOP) {
      setOrderOption(MARKET);
    }
    setAnchorOnFromAmount(true);
    setFromValue("");
    setToValue("");
    setTriggerPriceValue("");
    setTriggerRatioValue("");
  };

  const onConfirmationClick = () => {
    if (!active) {
      props.connectWallet();
      return;
    }

    if (needOrderBookApproval) {
      approveOrderBook();
      return;
    }

    setIsPendingConfirmation(true);

    if (orderOption === LIMIT) {
      createIncreaseOrder();
      return;
    }

    increasePosition();
  };

  function approveFromToken() {
    approveTokens({
      setIsApproving,
      library,
      tokenAddress: fromToken.address,
      spender: routerAddress,
      chainId: chainId,
      onApproveSubmitted: () => {
        setIsWaitingForApproval(true);
      },
      infoTokens,
      getTokenInfo,
      pendingTxns,
      setPendingTxns,
    });
  }

  const onClickPrimary = () => {
    if (isStopOrder) {
      setOrderOption(MARKET);
      return;
    }

    if (!active) {
      props.connectWallet();
      return;
    }

    if (needPositionRouterApproval) {
      approvePositionRouter({
        sentMsg: t`Enable leverage sent.`,
        failMsg: t`Enable leverage failed.`,
      });
      return;
    }

    if (needApproval) {
      approveFromToken();
      return;
    }

    if (needOrderBookApproval) {
      setOrdersToaOpen(true);
      return;
    }

    const [, modal, errorCode] = getError();

    if (modal) {
      setModalError(errorCode);
      return;
    }

    setIsConfirming(true);
    setIsHigherSlippageAllowed(false);
  };

  const isStopOrder = orderOption === STOP;
  const showFromAndToSection = !isStopOrder;
  const showTriggerPriceSection = !isMarketOrder && !isStopOrder;

  let fees;
  let feesUsd;
  let feeBps;
  // let swapFees;
  let positionFee;

  if (toUsdMax) {
    positionFee = toUsdMax.mul(isSuperTrader ? MARGIN_FEE_BASIS_POINTS_SUPER : MARGIN_FEE_BASIS_POINTS_NORMAL).div(BASIS_POINTS_DIVISOR);
    feesUsd = positionFee;

    // const { feeBasisPoints } = getNextToAmount(
    //   chainId,
    //   fromAmount,
    //   fromTokenAddress,
    //   collateralTokenAddress,
    //   infoTokens,
    //   undefined,
    //   undefined,
    //   usdgSupply,
    //   totalTokenWeights,
    //   false
    // );
    // if (feeBasisPoints) {
    //   swapFees = fromUsdMin.mul(feeBasisPoints).div(BASIS_POINTS_DIVISOR);
    //   feesUsd = feesUsd.add(swapFees);
    // }
    // feeBps = feeBasisPoints;
    feeBps = 0;
  }

  const leverageMarksNormal = {
    2: "2x",
    10: "10x",
    50: "50x",
    100: "100x",
    150: "150x",
    200: "200x",
    250: "250x",
    300: "300x",
  };

  const leverageMarksSuper = {
    2: "2x",
    100: "100x",
    300: "300x",
    500: "500x",
    700: "700x",
    900: "900x",
    1100: "1100x",
    1250: "1250x",
  };

  const stopLossMarks = {
    10: "-10%",
    20: "-20%",
    30: "-30%",
    40: "-40%",
    50: "-50%",
    60: "-60%",
    70: "-70%",
  }

  const takeProfitMarks = {
    10: "10%",
    200: "200%",
    400: "400%",
    600: "600%",
    800: "800%",
    1000: "1000%",
  }

  if (!fromToken || !toToken) {
    return null;
  }

  let hasZeroBorrowFee = false;
  let borrowFeeText;
  if (isLong && toTokenInfo && toTokenInfo.fundingRate) {
    borrowFeeText = formatAmount(toTokenInfo.fundingRate, 4, 4) + "% / 1h";
    if (toTokenInfo.fundingRate.eq(0)) {
      hasZeroBorrowFee = true
    }
  }

  function setFromValueToMaximumAvailable() {
    if (!fromToken || !fromBalance) {
      return;
    }

    const maxAvailableAmount = fromBalance;
    setFromValue(formatAmountFree(maxAvailableAmount, fromToken.decimals, fromToken.decimals));
    setAnchorOnFromAmount(true);
  }

  function shouldShowMaxButton() {
    if (!fromToken || !fromBalance) {
      return false;
    }
    const maxAvailableAmount = fromBalance;
    return fromValue !== formatAmountFree(maxAvailableAmount, fromToken.decimals, fromToken.decimals);
  }

  const SWAP_LABELS = {
    [LONG]: t`Long`,
    [SHORT]: t`Short`,
    [SWAP]: t`Swap`,
  };

  return (
    <div className="Exchange-swap-box">
      {/* <div className="Exchange-swap-wallet-box App-box">
        {active && <div className="Exchange-swap-account" >
        </div>}
      </div> */}
      <div className="Exchange-swap-box-inner App-box-highlight">
        <div>
          <Tab
            icons={SWAP_ICONS}
            options={SWAP_OPTIONS}
            optionLabels={SWAP_LABELS}
            option={swapOption}
            onChange={onSwapOptionChange}
            className="Exchange-swap-option-tabs"
          />
          {flagOrdersEnabled && (
            <Tab
              options={orderOptions}
              optionLabels={orderOptionLabels}
              className="Exchange-swap-order-type-tabs"
              type="inline"
              option={orderOption}
              onChange={onOrderOptionChange}
            />
          )}
        </div>
        {showFromAndToSection && (
          <React.Fragment>
            <div className="Exchange-swap-section">
              <div className="Exchange-swap-section-top">
                <div className="muted">
                  {fromUsdMin && (
                    <div className="Exchange-swap-usd">
                      <Trans>Pay: {formatAmount(fromUsdMin, USD_DECIMALS, 0, true)} USD</Trans>
                    </div>
                  )}
                  {!fromUsdMin && t`Pay`}
                </div>
                {fromBalance && (
                  <div className="muted align-right clickable" onClick={setFromValueToMaximumAvailable}>
                    <Trans>Balance: {formatAmount(fromBalance, fromToken.decimals, 0, true)}</Trans>
                  </div>
                )}
              </div>
              <div className="Exchange-swap-section-bottom">
                <div className="Exchange-swap-input-container">
                  <input
                    type="number"
                    min="0"
                    placeholder="0.0"
                    className="Exchange-swap-input"
                    value={fromValue}
                    onChange={onFromValueChange}
                  />
                  {shouldShowMaxButton() && (
                    <div className="Exchange-swap-max" onClick={setFromValueToMaximumAvailable}>
                      <Trans>MAX</Trans>
                    </div>
                  )}
                </div>
                <div className="Exchange-swap-input-container-tokenselector">
                  {/* USDC */}
                  {/* <TokenSelector
                    label={t`Pay`}
                    chainId={chainId}
                    tokenAddress={fromTokenAddress}
                    onSelectToken={onSelectFromToken}
                    tokens={fromTokens}
                    infoTokens={infoTokens}
                    showMintingCap={false}
                    showTokenImgInDropdown={true}
                  /> */}
                  {fromTokens[0].symbol}
                </div>
              </div>
            </div>
            {/* <div className="Exchange-swap-ball-container">
              <div className="Exchange-swap-ball" onClick={switchTokens}>
                <IoMdSwap className="Exchange-swap-ball-icon" />
              </div>
            </div> */}
            <div className="Exchange-swap-section">
              <div className="Exchange-swap-section-top">
                <div className="muted">
                  {toUsdMax && (
                    <div className="Exchange-swap-usd">
                      {getToLabel()}: {formatAmount(toUsdMax, USD_DECIMALS, 0, true)} USD
                    </div>
                  )}
                  {!toUsdMax && getToLabel()}
                </div>
                {(isLong || isShort) && hasLeverageOption && (
                  <div className="muted align-right">
                    <Trans>Leverage</Trans>: {parseFloat(leverageOption).toFixed(2)}x
                  </div>
                )}
              </div>
              <div className="Exchange-swap-section-bottom">
                <div>
                  <input
                    type="number"
                    min="0"
                    placeholder="0.0"
                    className="Exchange-swap-input"
                    value={toValue}
                    onChange={onToValueChange}
                  />
                </div>
                <div className="Exchange-swap-input-container-tokenselector">
                  {/* <TokenSelector
                    label={getTokenLabel()}
                    chainId={chainId}
                    tokenAddress={collateralTokenAddress}
                    onSelectToken={onSelectToToken}
                    tokens={collateralTokens}
                    infoTokens={infoTokens}
                    showTokenImgInDropdown={true}
                  /> */}
                  {collateralToken.symbol}
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
        {showTriggerPriceSection && (
          <div className="Exchange-swap-section">
            <div className="Exchange-swap-section-top">
              <div className="muted">
                <Trans>Price</Trans>
              </div>
              <div
                className="muted align-right clickable"
                onClick={() => {
                  setTriggerPriceValue(formatAmountFree(entryMarkPrice, USD_DECIMALS, 4));
                }}
              >
                <Trans>Mark: {formatAmount(entryMarkPrice, USD_DECIMALS, 4, true)}</Trans>
              </div>
            </div>
            <div className="Exchange-swap-section-bottom">
              <div className="Exchange-swap-input-container">
                <input
                  type="number"
                  min="0"
                  placeholder="0.0"
                  className="Exchange-swap-input"
                  value={triggerPriceValue}
                  onChange={onTriggerPriceChange}
                />
              </div>
              <div className="PositionEditor-token-symbol">USD</div>
            </div>
          </div>
        )}
        {(isLong || isShort) && !isStopOrder && (
          <div className="Exchange-leverage-box">
            <div className="Exchange-leverage-setting">
              <div className="Exchange-leverage-slider-settings">
                <span className="muted">{isSuperTrader ? "Leverage(2x-1250x)" : "Leverage(2x-300x)"}</span>
                <input
                  type="text"
                  pattern="[0-9]*"
                  inputmode="decimal"
                  maxLength="4"
                  className="Input"
                  value={leverageOption}
                  onChange={onLeverageChange}>
                </input>
              </div>
              <div
                className={cx("Exchange-leverage-slider", "App-slider", {
                  positive: isLong,
                  negative: isShort,
                })}
              >
                <Slider
                  min={2}
                  max={isSuperTrader ? 1250 : 300}
                  step={5}
                  marks={isSuperTrader ? leverageMarksSuper : leverageMarksNormal}
                  handle={leverageSliderHandle}
                  onChange={(value) => setLeverageOption(value)}
                  value={leverageOption}
                  defaultValue={leverageOption}
                />
              </div>
              <div className="Exchange-info-row">
                <div className="Exchange-info-label">
                  <Trans>Leverage Level</Trans>
                </div>
                <div className="align-right">
                  <Tooltip
                    handle={isSuperTrader ? "Super" : "Normal"}
                    position="right-bottom"
                    renderContent={() => {
                      return (
                        <div>
                          <Trans>
                            {isSuperTrader ? "You're already a super trader. So, you can use 1250x lerverage." : "To unlock the higher leverage, please stake 1000 BLP."}
                            <br />
                            <br />
                            · Higher leverage will increase your liquidation risk. Please manage your risk levels based on your position size.
                            <br />
                            <br />
                            <ExternalLink href="https://app.bluespade.xyz/#/buy_blp">
                              Stake 1000 BLP
                            </ExternalLink>
                            <br />
                            <ExternalLink href="https://bluespadexyz.gitbook.io/bluespade/trading#opening-a-position">
                              More Info
                            </ExternalLink>
                          </Trans>
                        </div>
                      );
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="Exchange-leverage-setting">
              <div className="Exchange-info-row">
                <div className="Exchange-info-label">
                  <Trans>Stop Loss</Trans>
                </div>
                <div className="align-right">
                  USDT
                </div>
              </div>
              <div
                className={cx("Exchange-leverage-slider", "App-slider", {
                  positive: isLong,
                  negative: isShort,
                })}
              >
                <Slider
                  min={10}
                  max={70}
                  step={2}
                  marks={stopLossMarks}
                  handle={stopLossSliderHandle}
                  onChange={(value) => setStopLossOption(value)}
                  value={stopLossOption}
                  defaultValue={stopLossOption}
                />
              </div>
              <div className="Exchange-info-row">
                <div className="Exchange-info-label">
                  <Trans>Take Profit</Trans>
                </div>
                <div className="align-right">
                  USDT
                </div>
              </div>
              <div
                className={cx("Exchange-leverage-slider", "App-slider", {
                  positive: isLong,
                  negative: isShort,
                })}
              >
                <Slider
                  min={10}
                  max={1000}
                  step={2}
                  marks={takeProfitMarks}
                  handle={takeProfitSliderHandle}
                  onChange={(value) => setTakeProfitOption(value)}
                  value={takeProfitOption}
                  defaultValue={takeProfitOption}
                />
              </div>
            </div>
            <div className="Exchange-info-row">
              <div className="Exchange-info-label">
                <Trans>Leverage</Trans>
              </div>
              <div className="align-right">
                {hasExistingPosition && toAmount && toAmount.gt(0) && (
                  <div className="inline-block muted">
                    {formatAmount(existingPosition.leverage, 4, 0)}x
                    <BsArrowRight className="transition-arrow" />
                  </div>
                )}
                {toAmount && leverage && leverage.gt(0) && `${formatAmount(leverage, 4, 0)}x`}
                {!toAmount && leverage && leverage.gt(0) && `-`}
                {leverage && leverage.eq(0) && `-`}
              </div>
            </div>
            <div className="Exchange-info-row">
              <div className="Exchange-info-label">
                <Trans>Position Size</Trans>
              </div>
              <div className="align-right">
                {toUsdMax && leverage && leverage.gt(0) && `$${formatAmount(toUsdMax, USD_DECIMALS, 0, true)}`}
                {!toUsdMax && leverage && leverage.gt(0) && `-`}
                {leverage && leverage.eq(0) && `-`}
              </div>
            </div>
            <div className="Exchange-info-row">
              <div className="Exchange-info-label">
                <Trans>Entry Price</Trans>
              </div>
              <div className="align-right">
                {hasExistingPosition && toAmount && toAmount.gt(0) && (
                  <div className="inline-block muted">
                    ${formatAmount(existingPosition.averagePrice, USD_DECIMALS, 4, true)}
                    <BsArrowRight className="transition-arrow" />
                  </div>
                )}
                {nextAveragePrice && `$${formatAmount(nextAveragePrice, USD_DECIMALS, 4, true)}`}
                {!nextAveragePrice && `-`}
              </div>
            </div>
            <div className="Exchange-info-row">
              <div className="Exchange-info-label">
                <Trans>Stop Loss</Trans>
              </div>
              <div className="align-right">
                {hasExistingPosition && toAmount && toAmount.gt(0) && (
                  <div className="inline-block muted">
                    ${formatAmount(existingLiquidationPrice, USD_DECIMALS, 4, true)}
                    <BsArrowRight className="transition-arrow" />
                  </div>
                )}
                {toAmount &&
                  displayLiquidationPrice &&
                  `$${formatAmount(displayLiquidationPrice, USD_DECIMALS, 4, true)}`}
                {!toAmount && displayLiquidationPrice && `-`}
                {!displayLiquidationPrice && `-`}
              </div>
            </div>
            <ExchangeInfoRow label={t`Fees`}>
              <div>
                {!feesUsd && "-"}
                {feesUsd && (
                  <Tooltip
                    handle={`$${formatAmount(feesUsd, USD_DECIMALS, 2, true)}`}
                    position="right-bottom"
                    renderContent={() => {
                      return (
                        <div>
                          <div>
                            <StatsTooltipRow
                              label={isSuperTrader ? `Position Fee (0.05% of position size)` : `Position Fee (0.1% of position size)`}
                              value={formatAmount(positionFee, USD_DECIMALS, 4, true)}
                            />
                          </div>
                        </div>
                      );
                    }}
                  />
                )}
              </div>
            </ExchangeInfoRow>
          </div>
        )}
        {isStopOrder && (
          <div className="Exchange-swap-section Exchange-trigger-order-info">
            <Trans>
              Take-profit and stop-loss orders can be set after opening a position. <br />
              <br />
              There will be a "Close" button on each position row, clicking this will display the option to set trigger
              orders. <br />
              <br />
              For screenshots and more information, please see the{" "}
              <ExternalLink href="https://bluespadexyz.gitbook.io/bluespade/trading#stop-loss-take-profit-orders">docs</ExternalLink>
              .
            </Trans>
          </div>
        )}
        <div className="Exchange-swap-button-container">
          <button className="App-cta Exchange-swap-button" onClick={onClickPrimary} disabled={!isPrimaryEnabled()}>
            {getPrimaryText()}
          </button>
        </div>
      </div>
      {(isLong || isShort) && (
        <div className="App-box App-box-border Exchange-swap-market-box">
          <div className="Exchange-swap-market-box-title">
            {isLong ? t`Long` : t`Short`}&nbsp;{toToken.symbol}
          </div>
          <div className="App-card-divider" />
          <div className="Exchange-info-row">
            <div className="Exchange-info-label">
              <Trans>Entry Price</Trans>
            </div>
            <div className="align-right">
              <Tooltip
                handle={`$${formatAmount(entryMarkPrice, USD_DECIMALS, 4, true)}`}
                position="right-bottom"
                renderContent={() => {
                  return (
                    <div>
                      <Trans>
                        The position will be opened at {formatAmount(entryMarkPrice, USD_DECIMALS, 4, true)} USD with a
                        max slippage of {parseFloat(savedSlippageAmount / 100.0).toFixed(2)}%.
                        <br />
                        <br />
                        The slippage amount can be configured under Settings, found by clicking on your address at the
                        top right of the page after connecting your wallet.
                        <br />
                        <br />
                        <ExternalLink href="https://bluespadexyz.gitbook.io/bluespade/trading#opening-a-position">
                          More Info
                        </ExternalLink>
                      </Trans>
                    </div>
                  );
                }}
              />
            </div>
          </div>
          <div className="Exchange-info-row">
            <div className="Exchange-info-label">
              <Trans>Exit Price</Trans>
            </div>
            <div className="align-right">
              <Tooltip
                handle={`$${formatAmount(exitMarkPrice, USD_DECIMALS, 4, true)}`}
                position="right-bottom"
                renderContent={() => {
                  return (
                    <div>
                      <Trans>
                        If you have an existing position, the position will be closed at{" "}
                        {formatAmount(entryMarkPrice, USD_DECIMALS, 4, true)} USD.
                        <br />
                        <br />
                        This exit price will change with the price of the asset.
                        <br />
                        <br />
                        <ExternalLink href="https://bluespadexyz.gitbook.io/bluespade/trading#opening-a-position">
                          More Info
                        </ExternalLink>
                      </Trans>
                    </div>
                  );
                }}
              />
            </div>
          </div>
          <div className="Exchange-info-row">
            <div className="Exchange-info-label">
              <Trans>Borrow Fee</Trans>
            </div>
            <div className="align-right">
              <Tooltip
                handle={borrowFeeText}
                position="right-bottom"
                renderContent={() => {
                  return (
                    <div>
                      {hasZeroBorrowFee && (
                        <div>
                          {isLong && t`There are more shorts than longs, borrow fees for longing is currently zero`}
                          {isShort && t`There are more longs than shorts, borrow fees for shorting is currently zero`}
                        </div>
                      )}
                      {!hasZeroBorrowFee && (
                        <div>
                          <Trans>
                            The borrow fee is calculated as (assets borrowed) / (total assets in pool) * 0.01% per hour.
                          </Trans>
                          <br />
                          <br />
                          {isShort && t`You can change the "Collateral In" token above to find lower fees`}
                        </div>
                      )}
                      <br />
                      <ExternalLink href="https://bluespadexyz.gitbook.io/bluespade/trading#opening-a-position">
                        <Trans>More Info</Trans>
                      </ExternalLink>
                    </div>
                  );
                }}
              >
                {!hasZeroBorrowFee && null}
              </Tooltip>
            </div>
          </div>
          {renderAvailableLiquidity()}
        </div>
      )}
      <div className="App-box App-box-border Exchange-swap-market-box">
        <div className="Exchange-swap-market-box-title">
          <Trans>Useful Links</Trans>
        </div>
        <div className="App-card-divider"></div>
        <div className="Exchange-info-row">
          <div className="Exchange-info-label-button">
            <ExternalLink href="https://bluespadexyz.gitbook.io/bluespade/trading">
              <Trans>Trading guide</Trans>
            </ExternalLink>
          </div>
        </div>
        {/* <div className="Exchange-info-row">
          <div className="Exchange-info-label-button">
            <ExternalLink href={getLeaderboardLink()}>
              <Trans>Leaderboard</Trans>
            </ExternalLink>
          </div>
        </div> */}
        <div className="Exchange-info-row">
          <div className="Exchange-info-label-button">
            <ExternalLink href="https://bluespadexyz.gitbook.io/bluespade/trading#backup-rpc-urls">
              <Trans>Speed up page loading</Trans>
            </ExternalLink>
          </div>
        </div>
      </div>
      <NoLiquidityErrorModal
        chainId={chainId}
        fromToken={fromToken}
        toToken={toToken}
        isLong={isLong}
        isShort={isShort}
        modalError={modalError}
        setModalError={setModalError}
      />
      {renderOrdersToa()}
      {isConfirming && (
        <ConfirmationBox
          library={library}
          isHigherSlippageAllowed={isHigherSlippageAllowed}
          setIsHigherSlippageAllowed={setIsHigherSlippageAllowed}
          orders={orders}
          isLong={isLong}
          isMarketOrder={isMarketOrder}
          orderOption={orderOption}
          isShort={isShort}
          fromToken={fromToken}
          fromTokenInfo={fromTokenInfo}
          toToken={toToken}
          toTokenInfo={toTokenInfo}
          toAmount={toAmount}
          fromAmount={fromAmount}
          feeBps={feeBps}
          onConfirmationClick={onConfirmationClick}
          setIsConfirming={setIsConfirming}
          hasExistingPosition={hasExistingPosition}
          leverage={leverage}
          existingPosition={existingPosition}
          existingLiquidationPrice={existingLiquidationPrice}
          displayLiquidationPrice={displayLiquidationPrice}
          nextAveragePrice={nextAveragePrice}
          triggerPriceUsd={triggerPriceUsd}
          triggerRatio={triggerRatio}
          fees={fees}
          feesUsd={feesUsd}
          isSubmitting={isSubmitting}
          isPendingConfirmation={isPendingConfirmation}
          fromUsdMin={fromUsdMin}
          toUsdMax={toUsdMax}
          collateralTokenAddress={collateralTokenAddress}
          infoTokens={infoTokens}
          chainId={chainId}
          setPendingTxns={setPendingTxns}
          pendingTxns={pendingTxns}
          minExecutionFee={minExecutionFee}
          minExecutionFeeUSD={minExecutionFeeUSD}
          minExecutionFeeErrorMessage={minExecutionFeeErrorMessage}
        />
      )}
    </div>
  );
}
