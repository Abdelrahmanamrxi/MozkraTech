import React from 'react'
import logo from '../../assets/logo.png'
import i18n from 'i18next'
function Logo() {

  return (
    <div className='flex flex-row gap-2 items-center '>
         <img className='sm:w-16 w-12 h-12  sm:h-16' src={logo}/>  
         <p className='text-white font-bold  text-lg sm:text-xl'>{i18n.language==="en"?"Mozkra":"مذاكر"}<span className='text-primary'>{i18n.language==="en"?"Tech":"تك"}</span></p>
        </div>
  )
}

export default Logo
