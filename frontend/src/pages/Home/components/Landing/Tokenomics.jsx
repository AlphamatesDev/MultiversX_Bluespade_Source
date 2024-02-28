import Star1 from "../../assets/imgs/star-1.png";
import Star2 from "../../assets/imgs/star-2.png";
import Star3 from "../../assets/imgs/star-3.png";
import Dollar from "../../assets/imgs/dollar-1.png";

const Tokenomics = (perp) => {
  const { totalSupply, price, marketCap } = perp;

  return (
    <section className="bg-[#070707] border-t border-[#1E1E1E]">
      <div className="py-16 md:pt-24 md:pb-16">
        <h3 className="font-medium font-rem text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[8rem] mb-5 text-center text-secondary">
          BLU Tokenomics
        </h3>
        <div className="max-w-7xl mx-auto px-4 pt-10">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-1">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4 md:space-x-8">
                  <div className="flex-none">
                    <img src={Star1} alt="star-1" className="w-16 md:w-24" />
                  </div>
                  <div>
                    <h4 className="text-xl lg:text-2xl font-prompt text-primary mb-1 lg:mb-2">Total supply: </h4>
                    <h4 className="text-2xl lg:text-4xl font-prompt text-secondary">{totalSupply} BLU </h4>
                  </div>
                </div>
                <div className="flex items-center space-x-4 md:space-x-8">
                  <div className="flex-none">
                    <img src={Star2} alt="star-2" className="w-16 md:w-24" />
                  </div>
                  <div>
                    <h4 className="text-xl lg:text-2xl font-prompt text-[#6035DA] mb-1 lg:mb-2">Market cap: </h4>
                    <h4 className="text-2xl lg:text-4xl font-prompt text-secondary">$ {marketCap} </h4>
                  </div>
                </div>
                <div className="flex items-center space-x-4 md:space-x-8">
                  <div className="flex-none">
                    <img src={Star3} alt="star-3" className="w-16 md:w-24" />
                  </div>
                  <div>
                    <h4 className="text-xl lg:text-2xl font-prompt text-[#00F7CC] mb-1 lg:mb-2">Price: </h4>
                    <h4 className="text-2xl lg:text-4xl font-prompt text-secondary">$ {price} </h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <div className="justify-end flex items-end pt-8">
                <img src={Dollar} alt="dollar-1" className="w-[150px] md:w-full md:max-w-[75%] mt-[-4rem]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tokenomics;
