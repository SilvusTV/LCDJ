import clsx from 'clsx'
import { TLinks } from '../../app/Types/TLinks'

export default function Header(props: { className?: string; links: TLinks[] }) {
  return (
    <div
      className={clsx(
        'h-32 w-screen z-10 bg-orange-light flex items-center justify-between fixed gap-10 top-0 transition-transform duration-300 ease-in-out px-32',
        props.className
      )}
    >
      <div className={'flex flex-col items-center'}>
        <img src="/inertia/images/LOGO.webp" alt="La conserverie des jeunes" width={'100px'} />
        <p className={'font-bold text-2xl'}>La Conserve des Jeunes</p>
      </div>
      <div className={'flex gap-5'}>
        {props.links.map((link: TLinks) => {
          return (
            <a
              className={
                'bg-orange-light border-2 px-4 py-2 rounded-full border-orange-dark cursor-pointer max-sm:p-0 primary-btn text-center'
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
  )
}
