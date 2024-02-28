import React from "react";
import { Menu } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import cx from "classnames";
import "./ChartTokenSelector.css";
import { LONG, SHORT } from "lib/legacy";
import { getTokens, getWhitelistedTokens } from "config/tokens";
import { importImage } from "lib/legacy";
// import { SKALE } from "config/chains";

export default function ChartTokenSelector(props) {
  const { chainId, selectedToken, onSelectToken, swapOption } = props;

  const isLong = swapOption === LONG;
  const isShort = swapOption === SHORT;
  let options = getTokens(chainId);
  const whitelistedTokens = getWhitelistedTokens(chainId);
  const indexTokens = whitelistedTokens.filter((token) => !token.isStable);
  const shortableTokens = indexTokens.filter((token) => token.isShortable);

  if (isLong) {
    options = indexTokens;
  }
  if (isShort) {
    options = shortableTokens;
  }

  const onSelect = async (token) => {
    onSelectToken(token);
  };

  var value = selectedToken;
  const tokenPopupImage = importImage(`ic_${value.symbol?.toLowerCase()}_24.svg`);

  return (
    <Menu>
      <Menu.Button as="div">
        <button className={cx("App-cta small transparent chart-token-selector", { "default-cursor": false })}>
          <img src={tokenPopupImage} alt={value.name} className="token-logo" />
          <span className="chart-token-selector--current">{value.symbol} / USD</span>
          {<FaChevronDown />}
        </button>
      </Menu.Button>
      <div className="chart-token-menu">
        <Menu.Items as="div" className="menu-items chart-token-menu-items">
          {options.map((option, index) => {
            const tokenPopupImage = importImage(`ic_${option.symbol.toLowerCase()}_24.svg`);
            return (
              <Menu.Item key={index}>
                <div
                  className="menu-item"
                  onClick={() => {
                    onSelect(option);
                  }}
                >
                  <img src={tokenPopupImage} alt={option.name} className="token-logo" />
                  <span style={{ marginLeft: 5 }} className="token-label">
                    {option.symbol} / USD
                  </span>
                </div>
              </Menu.Item>
            )
          })}
        </Menu.Items>
      </div>
    </Menu>
  );
}
