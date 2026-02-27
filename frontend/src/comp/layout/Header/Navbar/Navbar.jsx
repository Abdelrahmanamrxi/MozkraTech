

// eslint-disable-next-line no-unused-vars
import {motion} from 'framer-motion'
import { Link } from 'react-router-dom'
import Logo from '../../../logo/Logo';
import { useState } from 'react'
function Navbar() {
      const links = [
     { name: 'Home', to: '/' },
     { name: 'Dashboard', to: '/dashboard' },
     { name: 'Schedule', to: '/dashboard/schedule' },
     { name: 'Friends', to: '/dashboard/friends' },
  ];
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  return (
    <>
  <div className='hidden lg:flex lg:flex-row lg:w-full lg:justify-between lg:items-center'>
  <Logo />

  <nav className="relative flex gap-12 text-white font-blinker text-lg">
    {links.map((link, i) => (
      <div
        key={link.name}
        className="relative cursor-pointer"
        onMouseEnter={() => setHoveredIndex(i)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <Link to={link.to} className="relative px-1">
          {link.name}
        </Link>
        {hoveredIndex === i && (
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-linear-to-r from-purple-400 via-purple-500 to-purple-800 rounded-full"
            layoutId="underline"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        )}
      </div>
    ))}
  </nav>

  <div className='flex items-center gap-2 text-white font-semibold text-lg font-blinker'>
    <button className="px-6 py-1 border border-white rounded-full transition-all cursor-pointer duration-300 ease-in-out hover:bg-white hover:text-primary hover:scale-105">
      Sign In
    </button>
    <button className="py-1 px-4 cursor-pointer bg-primary rounded-md transition-all duration-300 ease-in-out hover:rounded-full hover:scale-105">
      Get Started
    </button>
  </div>
</div>
 
</>
  )
}

export default Navbar
