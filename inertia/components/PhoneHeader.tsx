import { TLinks } from '../../app/Types/TLinks'
import { useState } from 'react'
import clsx from 'clsx'

export default function PhoneHeader(props: { className?: string; links: TLinks[] }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(!open)} className={'burger-button'}>
        <span className={clsx(open ? 'burger-to-close' : 'burger-to-open')} />
      </button>
      {open && (
        <div
          id={'backdrop'}
          className={'fixed w-screen h-screen bg-dark top-0 right-0 z-10 flex justify-end'}
          onClick={(event) => (event.target as HTMLElement).id === 'backdrop' && setOpen(false)}
        >
          <div
            className={
              'relative w-3/4 h-screen bg-orange-light flex flex-col py-5 transition-all duration-300 ease-in-out'
            }
          >
            <div className={'flex flex-col items-center h-1/4'}>
              <img
                src="/inertia/images/LOGO.webp"
                alt="La conserverie des jeunes"
                width={'100px'}
              />
              <p className={'font-bold text-2xl'}>La Conserve des Jeunes</p>
            </div>
            <div className={'flex flex-col gap-5 h-3/4 items-center'}>
              {props.links.map((link: TLinks) => {
                return (
                  <a
                    className={
                      'bg-orange-light border-2 px-4 py-2 rounded-full border-orange-dark cursor-pointer p-0 primary-btn text-center w-3/4'
                    }
                    href={link.url}
                    target={'_blank'}
                  >
                    {link.title}
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
