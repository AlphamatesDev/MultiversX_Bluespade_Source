const UseAppButton = () => {
  return (
    <div className='relative sm:mr-[20px] mb-[5px] w-[174.5px] h-[53px] rounded-[10px] bg-gradient-to-r from-[#1be1cf] via-[#3f7bd0] to-[#5637d1] hover:bg-gradient-to-l'>
      <a href="https://app.bluespade.xyz" target="_self" className='absolute top-[2px] left-[2px] rounded-[8px] w-[170.5px] font-[14px] h-[49px] bg-white hover:bg-gradient-to-l hover:from-[#1be1cf] hover:via-[#3f7bd0] hover:to-[#5637d1] dark:bg-[#0a0a1c]'>
        <p className='h-full pt-[13px] text-transparent bg-clip-text text-white text-center'>Use App</p>
      </a>
    </div>
  )
}

export default UseAppButton