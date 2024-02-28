import { ethers } from "ethers";
import Modal from "../Modal/Modal";
import { get1InchSwapUrl } from "domain/common";
import { Token } from "domain/tokens";
import { t, Trans } from "@lingui/macro";
import ExternalLink from "components/ExternalLink/ExternalLink";

const { AddressZero } = ethers.constants;

type Props = {
  chainId: number;
  modalError: string;
  isShort: boolean;
  isLong: boolean;
  fromToken: Token;
  toToken: Token;
  setModalError: () => void;
};

export default function NoLiquidityErrorModal({
  chainId,
  fromToken,
  toToken,
  isLong,
  isShort,
  modalError,
  setModalError,
}: Props) {
  // const inputCurrency = fromToken.address;
  const outputCurrency = fromToken.address;
  const swapTokenSymbol = fromToken.symbol;
  const oneInchSwapUrl = get1InchSwapUrl(chainId, AddressZero, outputCurrency);
  const label =
    modalError === "BUFFER" ? t`${fromToken.symbol} Required` : t`${fromToken.symbol} Pool Capacity Reached`;

  return (
    <Modal isVisible={Boolean(modalError)} setIsVisible={setModalError} label={label} className="Error-modal font-base">
      <div>
        <Trans>
          You need to select {swapTokenSymbol} as the "Pay" token to use it for collateral to initiate this trade.
        </Trans>
      </div>
      <br />
      <div>
        <Trans>
          As there is not enough liquidity in BLP to swap {fromToken.symbol} to {swapTokenSymbol}, you can use the
          option below to do so:
        </Trans>
      </div>
      <br />

      <ExternalLink href={oneInchSwapUrl}>
        <Trans>Buy {swapTokenSymbol} on 1inch</Trans>
      </ExternalLink>

      {isShort && (
        <div>
          <Trans>Alternatively, you can select a different "Collateral In" token.</Trans>
          <br />
        </div>
      )}
    </Modal>
  );
}
