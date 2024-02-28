import {
  BlueSpadeLogoAlpha,
  DarkModeImg,
  LightModeImg,
  BlueSpadeHeroSectionLight,
  BlueSpadeHeroSectionDark,
  IsoHeart,
  Polygon1,
  BluespadeHeroSectionDarkBGVideo
} from '../../services/Assets'
import TradeButton from '../buttons/TradeButton'
import UseAppButton from '../buttons/UseAppButton'
const Header = (props: { mode: string, onModeBtn: () => void }) => {
  const { mode, onModeBtn } = props
  return (
    <header className='mb-[20px] sm:mb-[40px] pt-[32px] md:pt-[72px]'>
      <section className='hero'>
        <div className='container mx-auto px-5 font-medium font-inter not-italic from-red-700 to-white'>
          <nav className='flex justify-between items-center mb-20'>
            <div className='logo w-[200px] md:w-[300px] mt-[-20px]'>
              <img src={BlueSpadeLogoAlpha} alt='BlueSpadeLogoAlpha.png' loading='lazy' width='100%' />
            </div>
            <div className='navbar md:flex hidden md:items-center md:justify-end'>
              <div className='nav-item'>
                <TradeButton />
              </div>
              <div className='nav-item'>
                <UseAppButton />
              </div>
            </div>
          </nav>
          <div className='container mx-auto px-5 flex flex-col-reverse items-center justify-between lg:flex-row z-10 relative'>
            <div className='description 2xl:w-full'>
              <h1 className='mb-[12px] lg:mb-[27px] xl:text-[6rem] sm:text-[4.5rem] text-[3.5rem] text-[#484848] leading-[58px] capitalize dark:text-white text-center lg:!text-left font-bold'>Welcome<span className='hidden sm:inline'> to Bluespade</span></h1>
              <p className='mb-[12px] lg:mb-[42px] text-2xl text-center lg:!text-left text-[#878787] capitalize dark:text-white-[76%]'>Trade with 1250x leverage, earn rewards, and stake BLP Tokens for daily fees & community benefits.</p>
              <div className='buttons grid justify-center lg:grid lg:justify-start gap-[10px] sm:flex'>
                <UseAppButton />
                <TradeButton />
              </div>
            </div>
            <div className='bluespade-hero-section relative 2xl:w-full xl:w-[800px] lg:w-[700px] mb-10 lg:mr-[-50px]'>
              <video muted loop autoPlay poster={BlueSpadeHeroSectionDark}>
                <source src={BluespadeHeroSectionDarkBGVideo} type='video/webm' />
              </video>
            </div>
          </div>
        </div>
      </section>
      <section className='realtime-stats'>
        {/* <div className='container mx-auto px-5 lg:grid lg:grid-cols-3 lg:gap-[30px] z-10 relative'>
          <div className='flex items-center p-[18px] col-span-1 border-[1px] border-[#c5e1f2] rounded-[20px] shadow-xl mb-5 dark:bg-[#1b1b34] dark:border-[#3f3f4e]'>
            <div className='ios-heart mr-[20px]'>
              <img src={IsoHeart} alt='IsoHeart.png' loading='lazy' />
            </div>
            <div className='stat-info w-[270px] font-montserrat'>
              <p className='mb-[10px] text-[#878787] text-xl dark:text-[#c8c8cd]'>USD Invested</p>
              <p className='mb-[10px] text-[#484848] text-[20px] font-semibold dark:text-white'>$29,000,000</p>
              <p className='flex items-center text-[#72ff99] text-xl'><img src={Polygon1} alt='Polygon1.png' loading='lazy' />&nbsp; $172,000 &nbsp;<span className='font-normal text-[13px] text-[#878787]'>(24h)</span></p>
            </div>
          </div>
          <div className='flex items-center p-[18px] col-span-1 border-[1px] border-[#c5e1f2] rounded-[20px] shadow-xl mb-5 dark:bg-[#1b1b34] dark:border-[#3f3f4e]'>
            <div className='ios-heart mr-[20px]'>
              <img src={IsoHeart} alt='IsoHeart.png' loading='lazy' />
            </div>
            <div className='stat-info w-[270px] font-montserrat'>
              <p className='mb-[10px] text-[#878787] text-xl dark:text-[#c8c8cd]'>USD Invested</p>
              <p className='mb-[10px] text-[#484848] text-[20px] font-semibold dark:text-white'>$29,000,000</p>
              <p className='flex items-center text-[#72ff99] text-xl'><img src={Polygon1} alt='Polygon1.png' loading='lazy' />&nbsp; $172,000 &nbsp;<span className='font-normal text-[13px] text-[#878787]'>(24h)</span></p>
            </div>
          </div><div className='flex items-center p-[18px] col-span-1 border-[1px] border-[#c5e1f2] rounded-[20px] shadow-xl mb-5 dark:bg-[#1b1b34] dark:border-[#3f3f4e]'>
            <div className='ios-heart mr-[20px]'>
              <img src={IsoHeart} alt='IsoHeart.png' loading='lazy' />
            </div>
            <div className='stat-info w-[270px] font-montserrat'>
              <p className='mb-[10px] text-[#878787] text-xl dark:text-[#c8c8cd]'>USD Invested</p>
              <p className='mb-[10px] text-[#484848] text-[20px] font-semibold dark:text-white'>$29,000,000</p>
              <p className='flex items-center text-[#72ff99] text-xl'><img src={Polygon1} alt='Polygon1.png' loading='lazy' />&nbsp; $172,000 &nbsp;<span className='font-normal text-[13px] text-[#878787]'>(24h)</span></p>
            </div>
          </div>
        </div> */}
      </section>
    </header >
  )
}

export default Header