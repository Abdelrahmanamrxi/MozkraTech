import React from 'react'
import Navbar from './Navbar/Navbar'
import NavbarMobile from './Navbar/NavbarMobile'
function Header() {
  return (
    <>
    <div className='flex font-sans bg-primary-dark justify-between items-center sm:p-8 p-5 flex-row'>
      <Navbar/>
      <NavbarMobile/>
    </div>
    {/** Linebetween Header & Body */}
    <div style={{
  height: '3px',
  background: 'rgba(200, 200, 220, 0.75)',
  boxShadow: '0 0 8px 3px rgba(200, 200, 220, 0.5)',
  filter: 'blur(1.5px)',
  opacity: '1',
  marginTop: '-5px',
}} />
    </>
  )
}

export default Header
