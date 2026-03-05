import React from 'react'

const ABOUT_LINKS = ['Courses', 'Guides', 'Webinars', 'News', 'About us']
const SECONDARY_LINKS = ['Testimonials', 'Contacts']

const ContactLines = () => (
  <div className="space-y-3 text-white/85 text-sm">
    <p>+1 (001) 981-76-17</p>
    <p>info@logoipsum.com</p>
  </div>
)

const TelegramIcon = () => (
  <svg
    width="18"
    height="15"
    viewBox="0 0 18 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.23741 6.45746C6.06923 4.34063 9.29121 2.94509 10.9033 2.27083C15.5063 0.345685 16.4627 0.0112675 17.0861 0.000107056C17.2232 -0.00220392 17.5298 0.0319646 17.7284 0.193996C17.8961 0.330811 17.9422 0.51563 17.9643 0.645347C17.9864 0.775063 18.0139 1.07056 17.992 1.30145C17.7426 3.93683 16.6633 10.3322 16.1142 13.2839C15.8818 14.5328 15.4244 14.9516 14.9815 14.9926C14.0189 15.0816 13.288 14.3529 12.3558 13.7385C10.897 12.7769 10.0729 12.1783 8.65691 11.24C7.02048 10.1557 8.08131 9.55967 9.0139 8.58566C9.25797 8.33076 13.4988 4.45196 13.5809 4.10009C13.5912 4.05608 13.6007 3.89204 13.5038 3.80543C13.4069 3.71881 13.2639 3.74843 13.1606 3.77199C13.0143 3.80538 10.6839 5.35425 6.16938 8.41859C5.5079 8.87533 4.90875 9.09787 4.37193 9.08621C3.78013 9.07335 2.64175 8.74974 1.79548 8.47313C0.757494 8.13385 -0.0674757 7.95447 0.00436067 7.37827C0.0417775 7.07814 0.452793 6.77121 1.23741 6.45746Z"
      fill="white"
    />
  </svg>
)

const InstagramIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 1.44578C10.1205 1.44578 10.4096 1.44578 11.2771 1.44578C12.0482 1.44578 12.4337 1.63855 12.7229 1.73494C13.1084 1.92771 13.3976 2.0241 13.6867 2.31325C13.9759 2.60241 14.1687 2.89157 14.2651 3.27711C14.3614 3.56627 14.4578 3.95181 14.5542 4.72289C14.5542 5.59036 14.5542 5.78313 14.5542 8C14.5542 10.2169 14.5542 10.4096 14.5542 11.2771C14.5542 12.0482 14.3614 12.4337 14.2651 12.7229C14.0723 13.1084 13.9759 13.3976 13.6867 13.6867C13.3976 13.9759 13.1084 14.1687 12.7229 14.2651C12.4337 14.3614 12.0482 14.4578 11.2771 14.5542C10.4096 14.5542 10.2169 14.5542 8 14.5542C5.78313 14.5542 5.59036 14.5542 4.72289 14.5542C3.95181 14.5542 3.56627 14.3614 3.27711 14.2651C2.89157 14.0723 2.60241 13.9759 2.31325 13.6867C2.0241 13.3976 1.83133 13.1084 1.73494 12.7229C1.63855 12.4337 1.54217 12.0482 1.44578 11.2771C1.44578 10.4096 1.44578 10.2169 1.44578 8C1.44578 5.78313 1.44578 5.59036 1.44578 4.72289C1.44578 3.95181 1.63855 3.56627 1.73494 3.27711C1.92771 2.89157 2.0241 2.60241 2.31325 2.31325C2.60241 2.0241 2.89157 1.83133 3.27711 1.73494C3.56627 1.63855 3.95181 1.54217 4.72289 1.44578C5.59036 1.44578 5.87952 1.44578 8 1.44578ZM8 0C5.78313 0 5.59036 0 4.72289 0C3.85542 0 3.27711 0.192772 2.79518 0.385543C2.31325 0.578314 1.83133 0.867471 1.3494 1.3494C0.867471 1.83133 0.674699 2.21687 0.385543 2.79518C0.192772 3.27711 0.0963856 3.85542 0 4.72289C0 5.59036 0 5.87952 0 8C0 10.2169 0 10.4096 0 11.2771C0 12.1446 0.192772 12.7229 0.385543 13.2048C0.578314 13.6867 0.867471 14.1687 1.3494 14.6506C1.83133 15.1325 2.21687 15.3253 2.79518 15.6145C3.27711 15.8072 3.85542 15.9036 4.72289 16C5.59036 16 5.87952 16 8 16C10.1205 16 10.4096 16 11.2771 16C12.1446 16 12.7229 15.8072 13.2048 15.6145C13.6867 15.4217 14.1687 15.1325 14.6506 14.6506C15.1325 14.1687 15.3253 13.7831 15.6145 13.2048C15.8072 12.7229 15.9036 12.1446 16 11.2771C16 10.4096 16 10.1205 16 8C16 5.87952 16 5.59036 16 4.72289C16 3.85542 15.8072 3.27711 15.6145 2.79518C15.4217 2.31325 15.1325 1.83133 14.6506 1.3494C14.1687 0.867471 13.7831 0.674699 13.2048 0.385543C12.7229 0.192772 12.1446 0.0963856 11.2771 0C10.4096 0 10.2169 0 8 0Z"
      fill="white"
    />
    <path
      d="M8 3.85542C5.68675 3.85542 3.85542 5.68675 3.85542 8C3.85542 10.3133 5.68675 12.1446 8 12.1446C10.3133 12.1446 12.1446 10.3133 12.1446 8C12.1446 5.68675 10.3133 3.85542 8 3.85542ZM8 10.6988C6.55422 10.6988 5.30121 9.54217 5.30121 8C5.30121 6.55422 6.45783 5.30121 8 5.30121C9.44578 5.30121 10.6988 6.45783 10.6988 8C10.6988 9.44578 9.44578 10.6988 8 10.6988Z"
      fill="white"
    />
    <path
      d="M12.241 4.72289C12.7733 4.72289 13.2048 4.29136 13.2048 3.75904C13.2048 3.22671 12.7733 2.79518 12.241 2.79518C11.7086 2.79518 11.2771 3.22671 11.2771 3.75904C11.2771 4.29136 11.7086 4.72289 12.241 4.72289Z"
      fill="white"
    />
  </svg>
)

const YoutubeIcon = () => (
  <svg
    width="20"
    height="15"
    viewBox="0 0 20 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.5 2.27679C19.25 1.33929 18.625 0.669643 17.75 0.401786C16.25 2.39483e-07 9.87499 0 9.87499 0C9.87499 0 3.62501 2.39483e-07 2.00001 0.401786C1.12501 0.669643 0.499996 1.33929 0.249996 2.27679C-3.81842e-06 4.01786 0 7.5 0 7.5C0 7.5 3.7998e-06 10.9821 0.375004 12.7232C0.625004 13.6607 1.25 14.3304 2.125 14.5982C3.625 15 10 15 10 15C10 15 16.25 15 17.875 14.5982C18.75 14.3304 19.375 13.6607 19.625 12.7232C20 10.9821 20 7.5 20 7.5C20 7.5 20 4.01786 19.5 2.27679ZM7.99999 10.7143V4.28572L13.25 7.5L7.99999 10.7143Z"
      fill="white"
    />
  </svg>
)

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#242038] to-[#665A9E] text-white px-6 md:px-12 lg:px-24 py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:gap-16 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.9fr)] items-start">
          {/* Newsletter section */}
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-white/60 mb-3">
              By the way
            </p>
            <h2 className="text-2xl font-spectral md:text-[32px] font-medium leading-snug mb-6">
              Subscribe for our newsletters
            </h2>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="max-w-md group"
            >
              <div className="flex items-center rounded-[12px] border border-primary bg-white/0 px-5 py-2.5 md:py-1.5 backdrop-blur-sm transition-all duration-200 group-hover:border-white/70 group-hover:bg-white/5 group-focus-within:border-white group-focus-within:bg-white/10 group-focus-within:shadow-[0_0_0_1px_rgba(255,255,255,0.7)]">
                <input
                  type="email"
                  required
                  placeholder="E-mail"
                  className="flex-1 bg-transparent text-sm md:text-base text-white placeholder:text-white/60 outline-none"
                />
                <button
                  type="submit"
                  className="ml-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-[#3A2B68] transition-all duration-200   group-hover:bg-primary group-focus-within:bg-primary group-hover:shadow-md group-focus-within:shadow-lg hover:-translate-y-[1px]"
                  aria-label="Subscribe"
                >
                  <span className="text-lg text-white leading-none group-hover:translate-x-[1px] group-focus-within:translate-x-[1px]  transition-transform">
                    →
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Links & contacts */}
          <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-10">
              <div>
                <h3 className="mb-4 text-xs font-medium tracking-[0.16em] uppercase text-white/60">
                  About us
                </h3>
                <ul className="space-y-2 text-white/80">
                  {ABOUT_LINKS.map((label) => (
                    <li key={label}>
                      <a
                        href="#"
                        className="hover:text-white transition-colors"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <h3 className="mb-3 text-xs font-medium tracking-[0.16em] uppercase text-white/60">
                    Contact us
                  </h3>
                  <ContactLines />
                </div>
              </div>

              <div className="mt-2 sm:mt-0 sm:ml-8">
                <h3 className="mb-4 text-xs font-medium tracking-[0.16em] uppercase text-transparent select-none">
                  .
                </h3>
                <ul className="space-y-2 text-white/80">
                  {SECONDARY_LINKS.map((label) => (
                    <li key={label}>
                      <a
                        href="#"
                        className="hover:text-white transition-colors"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div />
          </div>
        </div>

        {/* Bottom row (shared mobile & desktop) */}
        <div className="mt-8 md:mt-10 flex flex-col gap-3 text-[11px] text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 text-sm text-white/70">
            <div className="flex items-center gap-4 text-base">
              <button
                type="button"
                className="hover:opacity-80 transition-opacity"
                aria-label="Telegram"
              >
                <TelegramIcon />
              </button>
              <button
                type="button"
                className="hover:opacity-80 transition-opacity"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </button>
              <button
                type="button"
                className="hover:opacity-80 transition-opacity"
                aria-label="YouTube"
              >
                <YoutubeIcon />
              </button>
            </div>
          </div>

          <span className="order-1 sm:order-2">
            © 2026 — Copyright
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
