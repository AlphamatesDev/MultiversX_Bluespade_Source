import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import useSWR from "swr";
import styled from 'styled-components'
import "./BluebetContent.css";
import "react-sweet-progress/lib/style.css";
import Combobox from './Combobox';

import bluebetTopImg from "img/bluebet_top.png";

import { useChainId } from "lib/chains";
import { getContract } from "config/contracts";
import { callContract, contractFetcher } from "lib/contracts";
import { bigNumberify, formatAmount, parseValue } from "lib/numbers";

import { ethers } from "ethers";
import Reader from "abis/ReaderV2.json";
import Bluebet from "abis/Bluebet.json";
import Token from "abis/Token.json";
import { t } from "@lingui/macro";
import usdc from "img/ic_usdc_40.svg";
import { approveTokens } from "domain/tokens";
import {
  PLACEHOLDER_ACCOUNT,
} from "lib/legacy";

const Container = styled.div`
`

const StyledInfoInsufficientFudns = styled.div`
  width: 10%;
  align-items: left;
  font-size: 14px;
  color: #bbbbbb;
  font-size: 1.5rem;
`

const StyledInfoWalletBalance = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 50%;
  align-items: right;
  font-size: 1.5rem;
  color: #bbbbbb;
`

const StyledInputAreaRegister = styled.div`
  background: #212332;
  border-radius: 0.4rem;
  border: solid 1px rgb(111, 106, 106);
`

const StyledInputRegister = styled.input`
  background: transparent;
  border: none;
  margin-left: 15px;
  width: 100%;
  outline: none;
  color: #bbbbbb;
  font-size: 2rem;
  padding: 0.5rem;

  &:focus {
    border: none;
  }
  &:active {
    border: none;
  }
`

const InputRowRegister = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding-right: 10px;
`

const StyledInputArea = styled.div`
  margin-top: 20px;
  height: 80px;
  background: #212332;
  border-radius: 0.4rem;
  border: solid 1px rgb(111, 106, 106);
`

const StyledInput = styled.input`
  background: transparent;
  border: none;
  margin-left: 15px;
  width: 100%;
  outline: none;
  color: #bbbbbb;
  font-size: 2rem;

  &:focus {
    border: none;
  }
  &:active {
    border: none;
  }
`

const StyledButton = styled.button`
  width: 100%;
  min-width: 170px;
  background: linear-gradient(96.36deg, #1BE1CF -1.32%, #3F7BD0 49.23%, #5637D1 103.04%);
  border: none;
  cursor: pointer;
  color: white;
  border-radius: 0.8rem;
  font-size: 16px;
  padding: 10px 15px;
  margin-top: 10px;
  
  &:hover {
    background: linear-gradient(96.36deg, #5637D1 -1.32%, #3F7BD0 49.23%, #1BE1CF 103.04%);
  }
  &:disabled {
    background: linear-gradient(96.36deg, #1BE1CF -1.32%, #3F7BD0 49.23%, #5637D1 103.04%);
  }
`

const MaxButton = styled.button`
  background: #ffffff00;
  border: none;
  color: #557ccf;
  font-weight: bold;
  font-size: 1.7rem;

  &:hover {
    opacity: 0.7;
  }
`

const LabelRow = styled.div`
  height: 30%;
  display: flex;
  justify-content: flex-end;
  font-size: 1rem;
  padding-top: 10px;
  justify-content: space-between;
  margin-left: 20px;
  margin-right: 20px;
`

const InputRow = styled.div`
  height: 70%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding-right: 10px;
`

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`

const DropdownButton = styled.button`
  background-color: transparent; /* Green */
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledFlex = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.8rem;
  color: #a0a3c4;
`

const StyledImage = styled.img`
  width: 30px;
  margin-right: 5px;
`

const options = [
  { value: '100', label: '... no community(100)' },
  { value: '0', label: 'Bluespade(0)' },
  { value: '1', label: 'Raijins(1)' },
  { value: '2', label: 'Bluebet(2)' }
]

export default function BluebetContent(props) {
  const {
    setPendingTxns,
  } = props;

  const { active, library, account } = useWeb3React();
  const { chainId } = useChainId();

  const bluebetAddress = getContract(chainId, "Bluebet");
  const readerAddress = getContract(chainId, "Reader");
  const usdcAddress = getContract(chainId, "USDC");

  const { data: balanceArray0 } = useSWR(true && [true, chainId, readerAddress, "getTokenBalances", bluebetAddress], {
    fetcher: contractFetcher(library, Reader, [[usdcAddress]]),
  });

  const { data: balanceArray1 } = useSWR(active && [active, chainId, readerAddress, "getTokenBalances", account], {
    fetcher: contractFetcher(library, Reader, [[usdcAddress]]),
  });

  const { data: userInfo } = useSWR(active && [active, chainId, bluebetAddress, "userListByAddress", account], {
    fetcher: contractFetcher(library, Bluebet),
  });

  let usdcBalanceBluebet = bigNumberify(0);
  let usdcBalanceAccount = bigNumberify(0);

  if (balanceArray0) usdcBalanceBluebet = balanceArray0[0];
  if (balanceArray1) usdcBalanceAccount = balanceArray1[0];

  const regInputForAccount = React.useRef();
  const regInputForDiscordId = React.useRef();
  const regInputForCommunityId = React.useRef();
  const regInputForDeposit = React.useRef();
  const regInputForWithdraw = React.useRef();

  const [inputValueForAccount, setInputValueForAccount] = useState("");
  const [inputValueForDiscordId, setInputValueForDiscordId] = useState("");
  const [communityId, setCommunityId] = useState(null);
  const [inputValueForDeposit, setInputValueForDeposit] = useState(0);
  const [inputValueForWithdraw, setInputValueForWithdraw] = useState(0);
  const [isApproving, setIsApproving] = useState(false);
  const [isWaitingForApproval, setIsWaitingForApproval] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: tokenAllowance } = useSWR(
    [active, chainId, usdcAddress, "allowance", account || PLACEHOLDER_ACCOUNT, bluebetAddress],
    {
      fetcher: contractFetcher(library, Token),
    }
  );

  const inputAmountForDeposit = parseValue(inputValueForDeposit, 6)
  const needApproval = tokenAllowance && inputAmountForDeposit && inputAmountForDeposit.gt(tokenAllowance);

  useEffect(() => {
    if (active) {
      setInputValueForAccount(account);
      if (userInfo !== undefined) {
        setInputValueForDiscordId(userInfo[3] ? userInfo[1] : "");
        setCommunityId(userInfo[3] ? options[parseInt(userInfo[2].toString()) + 1] : null);
      }
    }      
    else {
      setInputValueForAccount("");
      setInputValueForDiscordId("");
      setCommunityId(null);
    }
    
    const discordid = window.location.href.search("discordid=");
    if (discordid > 0) {
      setInputValueForDiscordId(window.location.href.substring(discordid + 10, window.location.href.length));
    } else {
      setInputValueForDiscordId("");
    }

    setInputValueForDeposit(0);
    setInputValueForWithdraw(0);
  }, [active, userInfo, account])

  useEffect(() => {
    if (needApproval)
      setIsWaitingForApproval(false);
  }, [needApproval])

  const onMaxForDeposit = () => {
    let maxValue = formatAmount(usdcBalanceAccount, 6, 4);

    if (maxValue > 0) setInputValueForDeposit(maxValue);
  }

  const onMaxForWithdraw = () => {
    let maxValue = formatAmount(usdcBalanceBluebet, 6, 4);

    if (maxValue > 0) setInputValueForWithdraw(maxValue);
  }

  const onInputChangeForAccount = () => {
    setInputValueForAccount(regInputForAccount.current.value);
  }

  const onInputChangeForDeposit = () => {
    setInputValueForDeposit(regInputForDeposit.current.value);
  }

  const onInputChangeForWithdraw = () => {
    setInputValueForWithdraw(regInputForWithdraw.current.value);
  }

  const getErrorForUserRegister = () => {
    if (!inputValueForDiscordId)
      return ["Input your Discord ID"]

    if (communityId === undefined)
      return ["Select your Community ID"]

    if (communityId < -1)
      return ["Select your Community ID"]

    return [false];
  };

  const getErrorForDeposit = () => {
    if (!inputValueForDeposit)
      return ["Enter an amount"]

    const compareAmount = parseFloat(formatAmount(usdcBalanceAccount, 6, 4));
    if (inputValueForDeposit > compareAmount)
      return ["Insufficient Funds!"]

    return [false];
  };

  const getErrorForWithdraw = () => {
    if (!inputValueForWithdraw)
      return ["Enter an amount"]

    const compareAmount = parseFloat(formatAmount(usdcBalanceBluebet, 6, 4));
    if (inputValueForWithdraw > compareAmount)
      return ["Insufficient Funds!"]

    return [false];
  };

  const isEnabledForUserRegister = () => {
    if (!active) {
      return false;
    }
    const [error, modal] = getErrorForUserRegister();
    if (error && !modal) {
      return false;
    }
    if (isSubmitting) {
      return false;
    }

    return true;
  };

  const isEnabledForDeposit = () => {
    if (!active) {
      return false;
    }
    const [error, modal] = getErrorForDeposit();
    if (error && !modal) {
      return false;
    }
    if ((needApproval && isWaitingForApproval) || isApproving) {
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

  const isEnabledForWithdraw = () => {
    if (!active) {
      return false;
    }
    const [error, modal] = getErrorForWithdraw();
    if (error && !modal) {
      return false;
    }
    if ((needApproval && isWaitingForApproval) || isApproving) {
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

  const getTextRegister = () => {
    if (!active)
      return "Confirm your wallet connection!"

    const [error, modal] = getErrorForUserRegister();

    if (error && !modal) {
      return error;
    }

    if (isSubmitting) {
      return "Registering...";
    }

    if (userInfo !== undefined) {
      if (userInfo[3]) return "Already registered. Register again?"
    }
    return "Register";
  }

  const getTextDeposit = () => {
    if (!active)
      return "Confirm your wallet connection!"

    const [error, modal] = getErrorForDeposit();

    if (error && !modal) {
      return error;
    }

    if (needApproval && isWaitingForApproval) {
      return "Waiting for Approval";
    }
    if (isApproving) {
      return "Approving USDC";
    }
    if (needApproval) {
      return "Approve USDC";
    }

    if (isSubmitting) {
      return "Depositing...";
    }

    return "Deposit";
  }

  const getTextWithdraw = () => {
    if (!active)
      return "Confirm your wallet connection!"

    const [error, modal] = getErrorForWithdraw();

    if (error && !modal) {
      return error;
    }

    if (isSubmitting) {
      return "Withdrawing...";
    }

    return "Withdraw";
  }

  const approveFromToken = () => {
    approveTokens({
      setIsApproving,
      library,
      tokenAddress: usdcAddress,
      spender: bluebetAddress,
      chainId: chainId,
      onApproveSubmitted: () => {
        setIsWaitingForApproval(true);
      },
    });
  };

  const onClickRegisterUser = async () => {
    if (inputValueForDiscordId === "") {
      alert("Reminder: Please input your Discord ID.")
      return;
    }

    if (communityId === undefined) {
      alert("Reminder: Please select your Community ID.")
      return;
    }

    if (communityId < -1) {
      alert("Reminder: Please select your Community ID.")
      return;
    }

    setIsSubmitting(true);

    const contract = new ethers.Contract(bluebetAddress, Bluebet.abi, library.getSigner());
    const method = "registerUserInfo";
    const params = [inputValueForDiscordId, parseInt(communityId.value)];

    callContract(chainId, contract, method, params, {
      sentMsg: t`registerUserInfo submitted.`,
      failMsg: t`registerUserInfo failed.`,
      successMsg: `Registered User Info!`,
      setPendingTxns,
    })
      .then(async () => { })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  const onClickDeposit = async () => {
    if (needApproval) {
      approveFromToken();
      return;
    }

    depositToken();
  }

  const onClickWithdraw = async () => {
    if (needApproval) {
      approveFromToken();
      return;
    }

    withdrawToken();
  }

  const depositToken = () => {
    let amount = regInputForDeposit.current.value;
    if (amount <= 0) {
      return;
    }

    setIsSubmitting(true);

    const contract = new ethers.Contract(bluebetAddress, Bluebet.abi, library.getSigner());
    const method = "depositByUser";
    const value = parseValue(amount, 6)
    const params = [value];

    callContract(chainId, contract, method, params, {
      sentMsg: t`depositByUser submitted.`,
      failMsg: t`depositByUser failed.`,
      successMsg: `${(amount).toString()} USDC deposited!`,
      setPendingTxns,
    })
      .then(async () => { })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  const withdrawToken = () => {
    let amount = regInputForDeposit.current.value;
    if (amount <= 0) {
      return;
    }

    setIsSubmitting(true);

    const contract = new ethers.Contract(bluebetAddress, Bluebet.abi, library.getSigner());
    const method = "withdrawByUser";
    const value = parseValue(amount, 6)
    const params = [value];

    callContract(chainId, contract, method, params, {
      sentMsg: t`withdrawByUser submitted.`,
      failMsg: t`withdrawByUser failed.`,
      successMsg: `${(amount).toString()} USDC withdrawn!`,
      setPendingTxns,
    })
      .then(async () => { })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <div className="Bluebet-Glp">
      <div className="Bluebet-Top-card-options">
        <div className="Bluebet-Top-card-option-left">
          <div className="Bluebet-Top-card-option-left-status">
            <div className="Bluebet-Top-card-option-left-image-div">
              <img className="Bluebet-Top-card-option-left-image" src={bluebetTopImg} alt="MetaMask" />
            </div>
            <div className="Bluebet-Top-card-option-right-content">
              <div className="Bluebet-Tier-card-row-flex">
                <div className="Bluebet-Top-card-option-right-content-start-header">Register User</div>
              </div>
              <div className="Bluebet-Tier-card-row">
                <div className="Bluebet-Top-card-option-right-content-start">Your Account:</div>
                <StyledInputAreaRegister>
                  <InputRowRegister>
                    <StyledInputRegister
                      ref={regInputForAccount}
                      value={inputValueForAccount}
                      disabled={true}
                      components={{
                        IndicatorSeparator: () => null, DropdownIndicator: () => null
                      }}
                      onChange={onInputChangeForAccount}
                    />
                  </InputRowRegister>
                </StyledInputAreaRegister>
              </div>
              <div className="Bluebet-Tier-card-row">
                <div className="Bluebet-Top-card-option-right-content-start">Discord ID:</div>
                <StyledInputAreaRegister>
                  <InputRowRegister>
                    <StyledInputRegister
                      ref={regInputForDiscordId}
                      value={inputValueForDiscordId}
                      disabled={true}
                      components={{
                        IndicatorSeparator: () => null, DropdownIndicator: () => null
                      }}
                    />
                  </InputRowRegister>
                </StyledInputAreaRegister>
              </div>
              <div className="Bluebet-Tier-card-row">
                <div className="Bluebet-Top-card-option-right-content-start">Community ID:</div>
                <Combobox ref={regInputForCommunityId} options={options} value={communityId} onChange={(selectedOption) => setCommunityId(selectedOption)} />
              </div>
              <StyledButton id="buyBtn" onClick={onClickRegisterUser} disabled={!isEnabledForUserRegister()}>
                {getTextRegister()}
              </StyledButton>
            </div>
          </div>
        </div>
        <div className="Bluebet-Top-card-option-right">
        </div>
      </div>

      <div className="Bluebet-Tier-card-options">
        <div className="Bluebet-Top-card-option-right-content">
          <div className="Bluebet-Tier-card-row">
            <div className="Bluebet-Top-card-option-right-content-start-header">Deposit</div>
          </div>
          <div className="Bluebet-Tier-card-row">
            <div className="Bluebet-Top-card-option-right-content-start">Wallet Balance:</div>
            <div style={{ "overflow-wrap": "anywhere" }}>{`${formatAmount(usdcBalanceAccount, 6, 4)}`} USDC</div>
          </div>
          <div className="Bluebet-Tier-card-row">
            <div className="Bluebet-Top-card-option-right-content-start">Contract Balance:</div>
            <div style={{ "overflow-wrap": "anywhere" }}>{`${formatAmount(usdcBalanceBluebet, 6, 4)}`} USDC</div>
          </div>
          <Container>
            <div>
              <StyledInputArea>
                <LabelRow>
                  <StyledInfoInsufficientFudns id="insuFundsSpace">Amount&nbsp;</StyledInfoInsufficientFudns>
                  <StyledInfoWalletBalance>
                    <div>{`Available: `}&nbsp;</div>
                    <div>{`${formatAmount(usdcBalanceAccount, 6, 4)}`}</div>
                  </StyledInfoWalletBalance>
                </LabelRow>
                <InputRow>
                  <StyledInput
                    ref={regInputForDeposit}
                    type="number"
                    min={0.0}
                    value={inputValueForDeposit}
                    components={{
                      IndicatorSeparator: () => null, DropdownIndicator: () => null
                    }}
                    onChange={onInputChangeForDeposit}
                    placeholder="0.0"
                  />
                  <MaxButton onClick={onMaxForDeposit} scale="sm" variant="text">
                    MAX
                  </MaxButton>
                  <DropdownContainer>
                    <DropdownButton>
                      <StyledFlex>
                        <StyledImage src={usdc} />
                        <div>USDC</div>
                      </StyledFlex>
                    </DropdownButton>
                  </DropdownContainer>
                </InputRow>
              </StyledInputArea>
            </div>
            <StyledButton id="buyBtn" onClick={onClickDeposit} disabled={!isEnabledForDeposit()}>
              {getTextDeposit()}
            </StyledButton>
          </Container>
        </div>

        <div className="Bluebet-Top-card-option-right-content">
          <div className="Bluebet-Tier-card-row">
            <div className="Bluebet-Top-card-option-right-content-start-header">Withdraw</div>
          </div>
          <div className="Bluebet-Tier-card-row">
            <div className="Bluebet-Top-card-option-right-content-start">Wallet Balance:</div>
            <div style={{ "overflow-wrap": "anywhere" }}>{`${formatAmount(usdcBalanceAccount, 6, 4)}`} USDC</div>
          </div>
          <div className="Bluebet-Tier-card-row">
            <div className="Bluebet-Top-card-option-right-content-start">Contract Balance:</div>
            <div style={{ "overflow-wrap": "anywhere" }}>{`${formatAmount(usdcBalanceBluebet, 6, 4)}`} USDC</div>
          </div>
          <Container>
            <div>
              <StyledInputArea>
                <LabelRow>
                  <StyledInfoInsufficientFudns id="insuFundsSpace">Amount&nbsp;</StyledInfoInsufficientFudns>
                  <StyledInfoWalletBalance>
                    <div>{`Avaliable: `}&nbsp;</div>
                    <div>{`${formatAmount(usdcBalanceBluebet, 6, 4)}`}</div>
                  </StyledInfoWalletBalance>
                </LabelRow>
                <InputRow>
                  <StyledInput
                    ref={regInputForWithdraw}
                    type="number"
                    min={0.0}
                    value={inputValueForWithdraw}
                    components={{
                      IndicatorSeparator: () => null, DropdownIndicator: () => null
                    }}
                    onChange={onInputChangeForWithdraw}
                    placeholder="0.0"
                  />
                  <MaxButton onClick={onMaxForWithdraw} scale="sm" variant="text">
                    MAX
                  </MaxButton>
                  <DropdownContainer>
                    <DropdownButton>
                      <StyledFlex>
                        <StyledImage src={usdc} />
                        <div>USDC</div>
                      </StyledFlex>
                    </DropdownButton>
                  </DropdownContainer>
                </InputRow>
              </StyledInputArea>
            </div>
            <StyledButton id="buyBtn" onClick={onClickWithdraw} disabled={!isEnabledForWithdraw()}>
              {getTextWithdraw()}
            </StyledButton>
          </Container>
        </div>
      </div>
    </div>
  );
}
