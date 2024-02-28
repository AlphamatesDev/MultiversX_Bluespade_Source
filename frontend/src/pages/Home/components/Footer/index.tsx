import { BlueSpadeLogoAlpha, Twitter, Discord, Telegram, Medium } from '../../services/Assets'
const Footer = (props: { mode: string }) => {
  const { mode } = props
  return (
    <footer>
      <section className='footer-section relative'>
        <div className='container mx-auto px-5 z-10 relative'>
          <h2 className='mb-[15px] capitalize xl:text-[6rem] sm:text-[4.5rem] text-[3.5rem] text-[#484848] dark:text-white text-center font-bold'>Join us</h2>
          <div className='md:grid md:grid-cols-4 md:gap-[30px] mb-[100px] xl:mb-[235px]'>
            <a href="https://twitter.com/Blue__Spade" target="_blank">
              <button className='flex items-center justify-center h-[84px] rounded-[20px] w-[80%] p-[18px] shadow-lg border-[#c5e1f2] border dark:border-[#3f3f4e] mb-[20px] mx-auto md:w-full dark:bg-[#1e2140]'>
                <img src={Twitter} alt='Twitter.png' loading='lazy' className='mr-[12px]' />&nbsp;
                <p className='text-[#878787] text-[18px] mr-[20px]'>Twitter</p>
              </button>
            </a>
            <a href="https://discord.gg/bluespade" target="_blank">
              <button className='flex items-center justify-center h-[84px] rounded-[20px] w-[80%] p-[18px] shadow-lg border-[#c5e1f2] border dark:border-[#3f3f4e] mb-[20px] mx-auto md:w-full dark:bg-[#1e2140]'>
                <img src={Discord} alt='Discord.png' loading='lazy' className='mr-[12px]' />&nbsp;
                <p className='text-[#878787] text-[18px]'>Discord</p>
              </button>
            </a>
            <a href="https://t.me/BlueSpadexyz" target="_blank">
              <button className='flex items-center justify-center h-[84px] rounded-[20px] w-[80%] p-[18px] shadow-lg border-[#c5e1f2] border dark:border-[#3f3f4e] mb-[20px] mx-auto md:w-full dark:bg-[#1e2140]'>
                <img src={Telegram} alt='Telegram.png' loading='lazy' className='mr-[12px]' />&nbsp;
                <p className='text-[#878787] text-[18px]'>Telegram</p>
              </button>
            </a>
            <a href="https://bluespade.medium.com/" target="_blank">
              <button className='flex items-center justify-center h-[84px] rounded-[20px] w-[80%] p-[18px] shadow-lg border-[#c5e1f2] border dark:border-[#3f3f4e] mb-[20px] mx-auto md:w-full dark:bg-[#1e2140]'>
                <img src={Medium} alt='Medium.png' loading='lazy' className='mr-[12px]' />&nbsp;
                <p className='text-[#878787] text-[18px]'>Medium</p>
              </button>
            </a>
          </div>
          <div className='max-w-[300px] mx-auto xl:max-w-[400px] pb-[80px] xl:pb-[150px]'>
            <img src={BlueSpadeLogoAlpha} alt='BlueSpadeLogoAlpha.png' loading='lazy' width='100%' />
          </div>
        </div>
      </section>
    </footer>
  )
}

export default Footer