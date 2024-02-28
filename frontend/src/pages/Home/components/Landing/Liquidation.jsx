import Arrow1 from "../../assets/imgs/arrows-left.png";
import Arrow2 from "../../assets/imgs/arrows-right.png";
import TradeImage from "../../assets/imgs/reduce-trade.png";

const Liquidation = (perp) => {
  const { totalUsers, usdInvested } = perp;
  return (
    <section className="">
      {/* bg-fuchsia-600/10 */}
      <div className="max-w-[2200px] mx-auto px-4 py-20 md:pb-28 md:pt-32">
        <div className="md:grid md:grid-cols-2 gap-10">
          <div className="mb-10 md:mb-0">
            <h3 className="outline-text capitalize text-4xl sm:text-5xl md:text-7xl xl:text-[8rem] 2xl:text-[9rem] font-rem font-normal">
              Reduce
            </h3>
            <h3 className="capitalize text-4xl sm:text-5xl md:text-7xl xl:text-[8rem] 2xl:text-[9rem] font-rem font-normal text-secondary">
              Liquidation Risks
            </h3>
          </div>
          <div className="font-prompt  lg:px-16 xl:px-24">
            <div>
              <h4 className="text-primary text-2xl sm:text-xl md:text-2xl">/{totalUsers}</h4>
              <p className="text-secondary mt-2.5 leading-[1.12] sm:text-xl md:text-2xl">Registered Users</p>
            </div>
            <div className="mt-10">
              <h4 className="text-primary text-2xl sm:text-xl md:text-2xl">/$ {usdInvested}</h4>
              <p className="text-secondary mt-2.5 leading-[1.12] sm:text-xl md:text-2xl">USD Invested</p>
            </div>
            <div className="mt-10">
              <h4 className="text-primary text-2xl sm:text-xl md:text-2xl">/An Aggregate Of High-Quality Price Feeds Determine</h4>
              <p className="text-secondary mt-2.5 leading-[1.12] pr-4 sm:text-xl md:text-2xl">
                When Liquidations Occur. This Keeps Positions Safe From Temporary Wicks.
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 sm:gap-6 md:gap-10 lg:gap-16 xl:gap-20 items-center pt-10  md:pt-14 lg:pt-20">
          <div className="flex items-center justify-end">
            <div>
              <img src={Arrow1} alt="arrows-left" className=" w-1/2  md:w-[75%] lg:w-auto" />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="lg:max-w-xs">
              <img src={TradeImage} alt="reduce-trade" />
            </div>
          </div>
          <div className="flex items-center justify-start">
            <div>
              <img src={Arrow2} alt="arrows-right" className=" w-1/2  md:w-[75%] lg:w-auto ml-auto md:ml-0" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Liquidation;
