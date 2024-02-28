import useSWR from "swr";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { bigNumberify, expandDecimals, formatAmount, numberWithCommas } from "lib/numbers";
import { useGmxPrice, useTotalGmxSupply, useUserStat } from "domain/legacy";
import { USD_DECIMALS, GMX_DECIMALS, GLP_DECIMALS } from "lib/legacy";
import { getContract } from "config/contracts";
import { contractFetcher } from "lib/contracts";
import ReaderV2 from "abis/ReaderV2.json";
import GlpManager from "abis/GlpManager.json";

// import "./assets/tailwind.css";
import Header from "./components/Shared/Header";
import Hero from "./components/Landing/Hero";
import Liquidation from "./components/Landing/Liquidation";
import Tokenomics from "./components/Landing/Tokenomics";
import Feature from "./components/Landing/Feature";
import CostSec from "./components/Landing/CostSec";

const { AddressZero } = ethers.constants;

const Home = () => {
  const { active, library } = useWeb3React();

  let totalUsers = 0;

  const CRONOS = 25
  const POLYGON = 137

  const cronosUserStats = useUserStat(CRONOS);
  const polygonUserStats = useUserStat(POLYGON);

  if (cronosUserStats && cronosUserStats.uniqueCount) {
    totalUsers += cronosUserStats.uniqueCount;
  }

  if (polygonUserStats && polygonUserStats.uniqueCount) {
    totalUsers += polygonUserStats.uniqueCount;
  }

  const { total: totalGmxSupply } = useTotalGmxSupply();

  const { gmxPrice } = useGmxPrice(
    CRONOS,
    undefined,
    false
  );

  let gmxMarketCap;
  if (gmxPrice && totalGmxSupply) {
    gmxMarketCap = gmxPrice.mul(totalGmxSupply).div(expandDecimals(1, GMX_DECIMALS));
  }

  const readerAddress = getContract(CRONOS, "Reader");
  const gmxAddress = getContract(CRONOS, "GMX");
  const glpAddress = getContract(CRONOS, "GLP");
  const usdgAddress = getContract(CRONOS, "USDG");
  const glpManagerAddress = getContract(CRONOS, "GlpManager");

  const tokensForSupplyQuery = [gmxAddress, glpAddress, usdgAddress];
  const { data: totalSupplies } = useSWR(
    [`Dashboard:totalSupplies:${active}`, CRONOS, readerAddress, "getTokenBalancesWithSupplies", AddressZero],
    {
      fetcher: contractFetcher(library, ReaderV2, [tokensForSupplyQuery]),
    }
  );

  const { data: aums } = useSWR([`Dashboard:getAums:${active}`, CRONOS, glpManagerAddress, "getAums"], {
    fetcher: contractFetcher(library, GlpManager),
  });

  let aum;
  if (aums && aums.length > 0) {
    aum = aums[0].add(aums[1]).div(2);
  }

  let glpPrice;
  let glpSupply;
  let glpMarketCap = bigNumberify(0);
  if (aum && totalSupplies && totalSupplies[3]) {
    glpSupply = totalSupplies[3];

    glpPrice = aum && aum.gt(0) && glpSupply.gt(0)
      ? aum.mul(expandDecimals(1, GLP_DECIMALS)).div(glpSupply)
      : expandDecimals(1, USD_DECIMALS);

    glpMarketCap = glpPrice.mul(glpSupply).div(expandDecimals(1, GLP_DECIMALS));
  }

  ////////////////////////** POLYGON **/////////////////////////////////
  const readerAddressPoly = getContract(POLYGON, "Reader");
  const gmxAddressPoly = getContract(POLYGON, "GMX");
  const glpAddressPoly = getContract(POLYGON, "GLP");
  const usdgAddressPoly = getContract(POLYGON, "USDG");
  const glpManagerAddressPoly = getContract(POLYGON, "GlpManager");

  const tokensForSupplyQueryPoly = [gmxAddressPoly, glpAddressPoly, usdgAddressPoly];
  const { data: totalSuppliesPoly } = useSWR(
    [`Dashboard:totalSupplies:${active}`, POLYGON, readerAddressPoly, "getTokenBalancesWithSupplies", AddressZero],
    {
      fetcher: contractFetcher(library, ReaderV2, [tokensForSupplyQueryPoly]),
    }
  );

  const { data: aumsPoly } = useSWR([`Dashboard:getAums:${active}`, POLYGON, glpManagerAddressPoly, "getAums"], {
    fetcher: contractFetcher(library, GlpManager),
  });

  let aumPoly;
  if (aumsPoly && aumsPoly.length > 0) {
    aumPoly = aumsPoly[0].add(aumsPoly[1]).div(2);
  }

  let glpPricePoly;
  let glpSupplyPoly;
  let glpMarketCapPoly;
  if (aumPoly && totalSuppliesPoly && totalSuppliesPoly[3]) {
    glpSupplyPoly = totalSuppliesPoly[3];

    glpPricePoly = aumPoly && aumPoly.gt(0) && glpSupplyPoly.gt(0)
      ? aumPoly.mul(expandDecimals(1, GLP_DECIMALS)).div(glpSupplyPoly)
      : expandDecimals(1, USD_DECIMALS);

    glpMarketCapPoly = glpPricePoly.mul(glpSupplyPoly).div(expandDecimals(1, GLP_DECIMALS));
  }

  if (glpMarketCapPoly) {
    glpMarketCap = glpMarketCap.add(glpMarketCapPoly);
  }

  return (
    <div className="!text-base !font-prompt">
      <div className="bg-[url('imgs/hero-bg.png')] bg-cover bg-center bg-no-repeat">
        {/* Navigation Header  */}
        <Header />
        {/* End Navigation Header  */}
        <Hero />
      </div>

      {/* Liquidation Section  */}
      <Liquidation
        totalUsers={numberWithCommas(totalUsers.toFixed(0))}
        usdInvested={formatAmount(glpMarketCap, USD_DECIMALS, 0, true)}
      />
      {/* Liquidation Section  */}

      {/* Tokenomics Section  */}
      <Tokenomics 
        totalSupply={formatAmount(totalGmxSupply, GMX_DECIMALS, 0, true)}
        price={gmxPrice && (`${formatAmount(gmxPrice, USD_DECIMALS, 4, true)}`)}
        marketCap={formatAmount(gmxMarketCap, USD_DECIMALS, 0, true)}
      />
      {/* End Tokenomics Section  */}

      {/* Feature Section */}
      <Feature />
      {/* End Feature Section */}

      {/* Cost Section  */}
      <CostSec />
      {/* ENd Cost Section  */}
    </div>
  );
};

export default Home;
