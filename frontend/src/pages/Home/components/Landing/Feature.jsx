import Feature1 from "../../assets/imgs/feature-img-new.png";

const Feature = () => {
  return (
    <section className="bg-[#050511]">
      <div className="max-w-[2200px] mx-auto pr-4 pb-16 pt-10 sm:pt-16 md:pt-24">
        <div className="flex md:flex-row flex-col-reverse">
          <div className="w-1/2 sm:w-2/5 lg:-mt-44">
            <div className="max-w-[200px] md:-translate-x-8 md:max-w-[300px] lg:max-w-[400px]">
              <img src={Feature1} alt="feature-img" />
            </div>
          </div>
          <div className="w-full md:w-3/5 pl-4 lg:pl-10 xl:pl-20">
            <div className="sm:flex-row gap-6 flex-col flex sm:items-center justify-center sm:gap-14 xl:gap-20 border-b border-[#A1A1A1] pb-5 mb-10 xl:pr-10">
              <h3 className="outline-title capitalize text-5xl sm:text-6xl md:text-6xl font-rem lg:text-[75px] leading-none font-bold">
                /01
              </h3>
              <div className="pr-4">
                <h4 className="text-secondary font-medium text-2xl sm:text-2xl md:text-4xl font-prompt">
                  Fast & Secure
                </h4>
                <p className="text-secondary font-prompt mt-1 sm:text-xl md:text-2xl">
                  Advanced Security Measures Such As Smart Contract Audits And Insurance Coverage For Users&apos; Funds.
                </p>
              </div>
            </div>
            <div className="sm:flex-row gap-6 flex-col flex sm:items-center justify-center sm:gap-14 xl:gap-20 border-b border-[#A1A1A1] pb-5 mb-10 xl:pr-10">
              <h3 className="outline-title capitalize text-5xl sm:text-6xl md:text-6xl font-rem lg:text-[75px] leading-none font-bold">
                /02
              </h3>
              <div className="pr-4">
                <h4 className="text-secondary font-medium text-2xl sm:text-2xl md:text-4xl font-prompt">
                  1250x Leverage
                </h4>
                <p className="text-secondary font-prompt mt-1 sm:text-xl md:text-2xl">
                  Amplify Your Position By 1250 Times! Control A Larger Position With A Smaller Amount Of Capital.
                </p>
              </div>
            </div>
            <div className="sm:flex-row gap-6 flex-col flex sm:items-center justify-center sm:gap-14 xl:gap-20 border-b border-[#A1A1A1] pb-5 mb-10 xl:pr-10">
              <h3 className="outline-title capitalize text-5xl sm:text-6xl md:text-6xl font-rem lg:text-[75px] leading-none font-bold">
                /03
              </h3>
              <div className="pr-4">
                <h4 className="text-secondary font-medium text-2xl sm:text-2xl md:text-4xl font-prompt">
                  Community Benefits
                </h4>
                <p className="text-secondary font-prompt mt-1 sm:text-xl md:text-2xl">
                  Lower Fees, Faster Transactions, Staking Rewards, Governance Voting, And Partnerships With Protocols.{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature;
