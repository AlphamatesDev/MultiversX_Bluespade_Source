import { useState } from "react";
import Logo from "../../assets/imgs/logo.png";

const Header = () => {
  const [showMenu, setshowMenu] = useState(false);
  return (
    <header>
      <div className="max-w-[2200px] mx-auto pl-4 pr-8 pt-4">
        <div className="flex items-center justify-between py-5">
          <a href="/">
            <img src={Logo} alt="brand-icon" />
          </a>
          <nav className="!font-prompt">
            <ul
              className={`${
                showMenu ? "translate-x-0" : "translate-x-full lg:translate-x-0"
              } flex flex-col lg:flex-row justify-center lg:justify-start space-y-4 lg:space-y-0 items-center lg:space-x-10 bg-[#131313] opacity-90 lg:bg-transparent z-30 fixed lg:relative top-0 right-0 w-64 lg:w-auto h-full lg:h-auto transition-all ease-in-out duration-300 !text-3xl`}
            >
              <li className="!pb-0">
                <a
                  href="https://app.bluespade.xyz/#/dashboard"
                  target="_self"
                  className="text-[#FDFDFD] inline-block font-light"
                >
                  Dashboard
                </a>
              </li>
              <li className="!pb-0">
                <a
                  href="https://app.bluespade.xyz/#/buy"
                  target="_self"
                  className="text-[#FDFDFD] inline-block font-medium"
                >
                  Buy
                </a>
              </li>
              <li className="!pb-0">
                <a
                  href="https://app.bluespade.xyz/#/super_blp_rewards"
                  target="_self"
                  className="text-[#FDFDFD] inline-block font-light"
                >
                  SuperBLP
                </a>
              </li>
              <li className="!pb-0">
                <a href="https://stats.bluespade.xyz" target="_self" className="text-[#FDFDFD] inline-block font-light">
                  Analytics
                </a>
              </li>
              <li className="!pb-0">
                <a
                  href="https://app.bluespade.xyz/#/trade"
                  target="_self"
                  className="text-[#FDFDFD] inline-block font-light"
                >
                  Trade
                </a>
              </li>
            </ul>
            <button
              className="text-[#dfdfdf] relative z-50 bg-[#1C222F] rounded-full h-11 w-11 flex lg:hidden items-center justify-center"
              onClick={() => setshowMenu(!showMenu)}
            >
              {showMenu ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
