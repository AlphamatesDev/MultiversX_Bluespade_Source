import useSWR from "swr";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { expandDecimals, formatAmount, numberWithCommas } from "lib/numbers";
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

  const SKALE = 1444673419

  const skaleUserStats = useUserStat(SKALE);

  if (skaleUserStats && skaleUserStats.uniqueCount) {
    totalUsers += skaleUserStats.uniqueCount;
  }

  const { total: totalGmxSupply } = useTotalGmxSupply();

  const { gmxPrice } = useGmxPrice(
    undefined,
    false
  );

  let gmxMarketCap;
  if (gmxPrice && totalGmxSupply) {
    gmxMarketCap = gmxPrice.mul(totalGmxSupply).div(expandDecimals(1, GMX_DECIMALS));
  }

  ////////////////////////** SKALE **/////////////////////////////////
  const readerAddressSkale = getContract(SKALE, "Reader");
  const gmxAddressSkale = getContract(SKALE, "GMX");
  const glpAddressSkale = getContract(SKALE, "GLP");
  const usdgAddressSkale = getContract(SKALE, "USDG");
  const glpManagerAddressSkale = getContract(SKALE, "GlpManager");

  const tokensForSupplyQuerySkale = [gmxAddressSkale, glpAddressSkale, usdgAddressSkale];
  const { data: totalSuppliesSkale } = useSWR(
    [`Dashboard:totalSupplies:${active}`, SKALE, readerAddressSkale, "getTokenBalancesWithSupplies", AddressZero],
    {
      fetcher: contractFetcher(library, ReaderV2, [tokensForSupplyQuerySkale]),
    }
  );

  const { data: aumsSkale } = useSWR([`Dashboard:getAums:${active}`, SKALE, glpManagerAddressSkale, "getAums"], {
    fetcher: contractFetcher(library, GlpManager),
  });

  let aumSkale;
  if (aumsSkale && aumsSkale.length > 0) {
    aumSkale = aumsSkale[0].add(aumsSkale[1]).div(2);
  }

  let glpPriceSkale;
  let glpSupplySkale;
  let glpMarketCapSkale;
  if (aumSkale && totalSuppliesSkale && totalSuppliesSkale[3]) {
    glpSupplySkale = totalSuppliesSkale[3];

    glpPriceSkale = aumSkale && aumSkale.gt(0) && glpSupplySkale.gt(0)
      ? aumSkale.mul(expandDecimals(1, GLP_DECIMALS)).div(glpSupplySkale)
      : expandDecimals(1, USD_DECIMALS);

    glpMarketCapSkale = glpPriceSkale.mul(glpSupplySkale).div(expandDecimals(1, GLP_DECIMALS));
  }

  let glpMarketCap = 0;
  if (glpMarketCapSkale) {
    glpMarketCap = glpMarketCap.add(glpMarketCapSkale);
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
