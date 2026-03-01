/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { Menu, X, Home, LayoutDashboard, Calendar, Users, ChevronRight } from 'lucide-react'
import Logo from '../../../logo/Logo'
const navLinks = [
  { label: 'Home',      Icon: Home,            href: '#' },
  { label: 'Dashboard', Icon: LayoutDashboard, href: '#' },
  { label: 'Schedule',  Icon: Calendar,        href: '#' },
  { label: 'Friends',   Icon: Users,           href: '#' },
]
export default function NavbarMobile() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* ── Top bar ── */}
      <div className="lg:hidden w-full flex flex-row justify-between items-center px-5 py-4 bg-primary-dark">
        <Logo />
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="bg-primary/20 border border-primary/35 rounded-xl p-1.5 flex items-center cursor-pointer transition-colors hover:bg-primary/30"
        >
          <Menu className="text-secondary-light" size={23} />
        </button>
      </div>

      {/* ── Backdrop ── */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-primary-dark/65 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* ── Slide-in drawer ── */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 flex flex-col w-[min(340px,90vw)]
          bg-linear-to-br from-primary-dark to-[#1a1730]
          shadow-[-8px_0_40px_rgba(0,0,0,0.5)]
          transition-transform duration-400 ease-in-out
          font-sans
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-primary/20">
          <Logo />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="bg-primary/20 border border-primary/30 rounded-xl p-1.5 flex items-center cursor-pointer transition-colors hover:bg-primary/30"
          >
            <X className="text-secondary" size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-5 pt-7 pb-4 flex flex-col gap-1.5">
          <p className="text-primary-light text-[0.7rem] font-semibold tracking-[0.12em] uppercase mb-2.5 pl-3">
            Navigation
          </p>

          {navLinks.map(({ label, Icon, href }, i) => (
            <a
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="group flex items-center justify-between px-4 py-3.5 rounded-xl
                text-neutral-light text-[0.97rem] font-medium no-underline
                bg-white/3 border border-white/6
                hover:bg-primary/20 hover:border-primary/50
                transition-all duration-200"
              style={{
                animation: open ? `fadeSlideIn 0.4s ease ${i * 0.07 + 0.1}s both` : 'none',
              }}
            >
              <span className="flex items-center gap-3">
                <span className="flex items-center justify-center w-[34px] h-[34px] rounded-[9px] bg-primary/20">
                  <Icon size={17} className="text-primary" />
                </span>
                {label}
              </span>
              <ChevronRight size={15} className="text-primary-light" />
            </a>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="px-5 pt-5 pb-8 border-t border-primary/15 flex flex-col gap-2.5">
          {/* Sign In */}
          <a
            href="#"
            className="block text-center py-3.5 rounded-xl text-secondary text-[0.95rem] font-medium no-underline
              border border-primary/35 bg-transparent
              hover:bg-primary/12 hover:text-neutral-light
              transition-all duration-200"
          >
            Sign In
          </a>

          {/* Get Started */}
          <a
            href="#"
            className="block text-center py-3.5 rounded-xl text-neutral-light text-[0.95rem] font-semibold no-underline
              bg-linear-to-br from-primary to-[#7a4fb0]
              shadow-[0_4px_20px_rgba(144,103,198,0.4)]
              hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(144,103,198,0.55)]
              transition-all duration-150"
          >
            Get Started →
          </a>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(18px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  )
}