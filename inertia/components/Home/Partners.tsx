import Wave2 from '~/components/SVG/Wave2'

export default function Partners() {
  return (
    <div
      className={'flex relative bg-blue-light min-h-screen flex-col items-center max-sm:min-h-0'}
    >
      <Wave2 className={'fill-orange-dark'} />
      <h1 className={'text-7xl text-center font-extrabold m-20 max-sm:text-5xl max-sm:m-8 '}>
        Nos Partenaires
      </h1>
      <div
        className={
          'w-3/5 flex flex-row items-center gap-10 justify-center flex-wrap mt-32 max-sm:w-full max-sm:p-8 max-sm:my-20'
        }
      >
        <img src="/inertia/images/Partners/CVEC.png" alt="CVEC" className={'partner-img'} />
        <img src="/inertia/images/Partners/Crous.png" alt="Crous" className={'partner-img'} />
        <img
          src="/inertia/images/Partners/ParisLaMie.png"
          alt="Paris la Mie"
          className={'partner-img'}
        />
        <img
          src="/inertia/images/Partners/ParisAnim.png"
          alt="Paris Anim\'"
          className={'partner-img'}
        />
        <img src="/inertia/images/Partners/Deloitte.png" alt="Deloitte" className={'partner-img'} />
        <img
          src="/inertia/images/Partners/ParisNeuf.png"
          alt="Mairie de Paris Neuf"
          className={'partner-img'}
        />
        <img src="/inertia/images/Partners/Afev.png" alt="Afev" className={'partner-img'} />
      </div>
    </div>
  )
}
