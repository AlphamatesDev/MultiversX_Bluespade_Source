import Heroline from "../../assets/imgs/hero-line.png";
import Arrow from "../../assets/imgs/app-arrow.png";
import HeroOne from "../../assets/imgs/hero-image-new-1.png";
import HeroTwo from "../../assets/imgs/hero-trade-image.png";
import twitter from "../../assets/imgs/twitter.png";
import discord from "../../assets/imgs/discord.png";
import telegram from "../../assets/imgs/telegram.png";
import medium from "../../assets/imgs/medium.png";

const Hero = () => {
  return (
    <section>
      <div className="max-w-[2200px] mx-auto pl-8">
        <div className="pt-32 pb-16 lg:pb-10 xl:pb-28 relative overflow-hidden sm:overflow-visible">
          <div className="sm:w-3/4">
            <h1 className="outline-text capitalize text-5xl sm:text-6xl md:text-7xl xl:text-[8rem] 2xl:text-[10rem] font-rem font-normal text-center sm:!text-left">
              Welcome to
            </h1>
            <div className="text-[#FDFDFD] sm:flex sm:items-center flex-wrap xl:flex-nowrap mb-8">
              <h3 className="font-rem text-5xl sm:text-6xl md:text-7xl xl:text-[8rem] 2xl:text-[10rem] xl:leading-[0px] font-bold text-center sm:text-left">
                Bluespade
              </h3>
              <div className="flex max-w-[400px] pt-5 xl:pt-6 ml-2">
                <div className="flex-none pt-3 xl:pt-7">
                  <img src={Heroline} alt="hero-line" />
                </div>
                <p className="font-prompt font-light -ml-[70px] flex-grow xl:pt-6 sm:text-xl md:text-2xl">
                  Trade With 1250x Leverage, Earn Rewards, And Stake BLP Tokens For Daily Fees & Community Benefits.
                </p>
              </div>
            </div>
            <div className="md:w-72">
              <a href="https://app.bluespade.xyz" target="_self" className='relative z-10 md:w-full bg-transparent hover:bg-primary py-4 space-x-4 rounded-full border border-primary flex items-center justify-center text-white uppercase font-rem text-lg sm:text-xl xl:text-3xl duration-300 transition-all ease-in-out px-8'>
                <span>USE APP</span>
                <img src={Arrow} alt="app-arrow" className="w-4 sm:w-auto" />
              </a>
            </div>
            <div className="flex space-y-4 sm:space-y-0 justify-start sm:items-center sm:space-x-5 mt-8 sm:mt-12 sm:flex-row flex-col">
              <a
                href="https://twitter.com/Blue__Spade" target="_blank" rel="noreferrer"
                className="bg-[#333333] hover:bg-[#131313] transition-all ease-in-out duration-300 w-12 h-12 sm:w-14 sm:h-14 xl:w-20 xl:h-20 rounded-lg p-2 flex items-center justify-center"
              >
                <img src={twitter} alt="twitter" />
              </a>
              <a
                href="https://discord.gg/into-blue" target="_blank" rel="noreferrer"
                className="bg-[#333333]  hover:bg-[#131313] transition-all ease-in-out duration-300  w-12 h-12 sm:w-14 sm:h-14 xl:w-20 xl:h-20 rounded-lg p-2 flex items-center justify-center"
              >
                <img src={discord} alt="discord" />
              </a>
              <a
                href="https://t.me/BlueSpadexyz" target="_blank" rel="noreferrer"
                className="bg-[#333333]  hover:bg-[#131313] transition-all ease-in-out duration-300 w-12 h-12 sm:w-14 sm:h-14 xl:w-20 xl:h-20 rounded-lg p-2 flex items-center justify-center"
              >
                <img src={telegram} alt="telegram" />
              </a>
              <a
                href="https://bluespade.medium.com" target="_blank" rel="noreferrer"
                className="bg-[#333333] hover:bg-[#131313] transition-all ease-in-out duration-300  w-12 h-12 sm:w-14 sm:h-14 xl:w-20 xl:h-20 rounded-lg p-2 flex items-center justify-center"
              >
                <img src={medium} alt="medium" />
              </a>
            </div>
            <div className="absolute xl:top-[-3rem] top-[50%] -translate-y-[15%] sm:translate-y-[-70%] md:translate-y-[-50%] lg:translate-y-[-40%] xl:translate-y-0 -right-12 flex sm:w-auto justify-end">
              <img src={HeroOne} alt="hero-1" className="w-[65vw] sm:w-[31vw] 2xl:w-[93%]" />
              <div className="absolute bottom-[13%] -left-[16%]">
                <img src={HeroTwo} alt="hero-trade" className="w-[37vw] sm:w-[18vw] 2xl:w-[90%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
