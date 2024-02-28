const TradeButton = () => {
  return (
    <div className='grid grid-cols-4 sm:mr-[20px] mb-2 w-[174.5px] h-[53px]'>
      <a href="https://app.bluespade.xyz/#/trade" target="_self" className='w-[174.5px] h-[53px] rounded-[10px] text-white bg-gradient-to-r from-[#1be1cf] via-[#3f7bd0] to-[#5637d1] capitalize hover:bg-gradient-to-l'>
        <p className='text-center h-full pt-[14px]'>Trade now</p>
      </a>
    </div>
  )
}

export default TradeButton