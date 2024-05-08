import clsx from 'clsx'

export default function Header(props: { className?: string }) {
  return (
    <div
      className={clsx(
        'h-32 w-screen z-10 bg-orange-light flex items-center justify-center fixed gap-10 top-0 transition-transform duration-300 ease-in-out',
        props.className
      )}
    >
      <img src="/inertia/images/LOGO.png" alt="La conserverie des jeunes" width={'100px'} />
      <p className={'font-bold text-2xl'}>La Conserverie des Jeunes</p>
    </div>
  )
}
