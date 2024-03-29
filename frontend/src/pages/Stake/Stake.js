import React from "react";

import { SKALE, getConstant } from "config/chains";

import StakeV2 from "./StakeV2";

export default function Stake(props) {
  const chainId = SKALE;
  const isV2 = getConstant(chainId, "v2");
  return isV2 ? <StakeV2 {...props} /> : <StakeV2 {...props} />;
}
