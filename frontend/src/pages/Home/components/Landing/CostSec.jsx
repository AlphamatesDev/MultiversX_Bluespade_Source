import TardeImage from "../../assets/imgs/trade-cost.png";
import twitter from "../../assets/imgs/twitter.png";
import discord from "../../assets/imgs/discord.png";
import telegram from "../../assets/imgs/telegram.png";
import medium from "../../assets/imgs/medium.png";

const CostSec = () => {
  return (
    <section>
      <div className="max-w-[2200px] mx-auto px-8 pb-12">
        <div className="py-16 md:py-20 lg:py-24 xl:py-28 relative">
          <h3
            style={{
              textShadow:
                "1px 1px 0 #fdfdfd, -1px -1px 0 #fdfdfd, 1px -1px 0 #fdfdfd, -1px 1px 0 #fdfdfd, 1px 1px 0 #fdfdfd",
            }}
            className="capitalize text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-rem font-normal"
          >
            Save On Costs
          </h3>
          <p className="text-secondary text-xl  md:text-2xl  lg:text-3xl mt-10 font-prompt max-w-4xl z-10 relative">
            /Enter And Exit Positions With <span className="text-primary">Minimal Spread And Zero Price Impact</span>.
            Get The Optimal Price Without Incurring Additional Costs.
          </p>
          <div className="absolute -top-14 sm:-top-20 right-0">
            <img
              src={TardeImage}
              alt="trade-cost"
              className="w-[30vw] sm:w-[25vw] md:w-[20vw] xl:max-w-[90%] 2xl:w-auto mx-auto"
            />
            <div
              style={{
                background: "linear-gradient(30deg, rgba(82, 65, 209, 0.55) 20.5%, rgba(0, 185, 225, 0.55) 125.51%)",
                filter: "blur(181.19468688964844px)",
              }}
              className="text-white absolute top-0 img-drop-shadow w-full h-full -z-[1]"
            ></div>
          </div>
        </div>
        <div className="flex space-y-4 sm:space-y-0 items-center justify-between border-b border-[#1E1E1E] pb-4">
          <p className="font-rem text-3xl text-secondary font-normal uppercase">Join Us</p>
          <div className="flex items-center space-x-4">
            <a
              href="https://twitter.com/Blue__Spade" target="_blank" rel="noreferrer"
              className="bg-primary  hover:bg-[#005B84] transition-all ease-in-out duration-300 w-12 h-12 sm:w-14 sm:h-14 rounded-lg p-2 flex items-center justify-center"
            >
              <img src={twitter} alt="twitter" />
            </a>
            <a
              href="https://discord.gg/into-blue" target="_blank" rel="noreferrer"
              className="bg-primary  hover:bg-[#005B84] transition-all ease-in-out duration-300  w-12 h-12 sm:w-14 sm:h-14 rounded-lg p-2 flex items-center justify-center"
            >
              <img src={discord} alt="discord" />
            </a>
            <a
              href="https://t.me/BlueSpadexyz" target="_blank" rel="noreferrer"
              className="bg-primary  hover:bg-[#005B84] transition-all ease-in-out duration-300 w-12 h-12 sm:w-14 sm:h-14 rounded-lg p-2 flex items-center justify-center"
            >
              <img src={telegram} alt="telegram" />
            </a>
            <a
              href="https://bluespade.medium.com" target="_blank" rel="noreferrer"
              className="bg-primary hover:bg-[#005B84] transition-all ease-in-out duration-300  w-12 h-12 sm:w-14 sm:h-14 rounded-lg p-2 flex items-center justify-center"
            >
              <img src={medium} alt="medium" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CostSec;
