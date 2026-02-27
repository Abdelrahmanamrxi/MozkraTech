import React from 'react'
import { Menu } from 'lucide-react'
import Logo from '../../../logo/Logo'
function NavbarMobile() {
  return (
    <div className='lg:hidden w-full flex flex-row justify-between items-center'>
        <Logo/>
        <Menu className='text-white' size={25}/>
    </div>
  )
}

export default NavbarMobile
