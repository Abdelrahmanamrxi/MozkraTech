import React from 'react'
import logo from '../../assets/logo.png'
function Logo() {
  return (
    <div className='flex flex-row gap-2 items-center '>
         <img className='sm:w-16 w-10 h-10  sm:h-16' src={logo}/>  
         <p className='text-white font-bold  text-lg sm:text-xl'>Mozkra<span className='text-primary'>Tech</span></p>
        </div>
  )
}

export default Logo
