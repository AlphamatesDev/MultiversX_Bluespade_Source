import { Trans } from "@lingui/macro";
import { BigNumber } from "ethers";
import { USD_DECIMALS } from "lib/legacy";
import "./StatsTooltip.css";
import { formatAmount } from "lib/numbers";

type Props = {
  title: string;
  total?: BigNumber;
  skaleValue?: BigNumber;
  showDollar?: boolean;
  decimalsForConversion: number;
  symbol: string;
  isFloatNum?: boolean;
};

export default function StatsTooltip({
  title,
  total,
  skaleValue,
  showDollar = true,
  decimalsForConversion = USD_DECIMALS,
  symbol,
  isFloatNum = false,
}: Props) {
  return (
    <>
      <p className="Tooltip-row">
        <span className="label">
          <Trans>on Skale:</Trans>
        </span>
        <span className="amount">
          {!isFloatNum && showDollar && "$"}
          {isFloatNum && ""+skaleValue}
          {!isFloatNum && formatAmount(skaleValue, decimalsForConversion, 0, true)}
          {!showDollar && symbol && " " + symbol}
        </span>
      </p>
      <div className="Tooltip-divider" />
      <p className="Tooltip-row">
        <span className="label">
          <Trans>Total:</Trans>
        </span>
        <span className="amount">
          {!isFloatNum && showDollar && "$"}
          {isFloatNum && "" + total}
          {!isFloatNum && formatAmount(total, decimalsForConversion, 0, true)}
          {!showDollar && symbol && " " + symbol}
        </span>
      </p>
    </>
  );
}
