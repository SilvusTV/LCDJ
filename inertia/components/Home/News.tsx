export default function News() {
  return (
    <div className={'h-screen bg-orange-dark flex flex-col items-center'}>
      <h1 className={'text-6xl text-center font-extrabold m-20 max-sm:text-5xl'}>Nos Actus</h1>
      <div className={'grid grid-cols-2 grid-rows-3 gap-10 h-3/4 w-4/5'}>
        <div
          className={
            'row-span-2 relative overflow-hidden flex items-end max-sm:col-span-2 max-sm:row-span-2'
          }
        >
          <a
            className={
              'hover:tracking-widest hover-animation z-1 w-full h-full content-end bg-gradient-to-b from-transparent to-black from-40%'
            }
            href={'#'}
            target={'_blank'}
          >
            <p className={'text-xl text-white underline p-4'}>Nos actions du mois</p>
          </a>
          <img
            src={'/inertia/images/news/1.jpg'}
            alt={'news image'}
            className={'absolute top-0 left-0 w-full h-full object-cover'}
          />
        </div>
        <div className={'relative overflow-hidden max-sm:row-start-3 flex items-end'}>
          <a
            className={
              'hover:tracking-widest hover-animation z-1 w-full h-full content-end bg-gradient-to-b from-transparent to-black from-40%'
            }
            href={'https://www.instagram.com/reel/C0uXf3SrIlJ/'}
            target={'_blank'}
          >
            <p className={'text-xl text-white underline p-4'}>
              Envie d’en voir plus ? Retour sur le Festisol
            </p>
          </a>
          <img
            src={'/inertia/images/news/2.jpg'}
            alt={'news image'}
            className={'absolute top-0 left-0 w-full h-full object-cover'}
          />
        </div>
        <div className={'relative overflow-hidden flex items-end col-start-2 max-sm:row-start-3'}>
          <a
            className={
              'hover:tracking-widest hover-animation z-1 w-full h-full content-end bg-gradient-to-b from-transparent to-black from-40%'
            }
            href={'https://www.instagram.com/p/C1opJs6rscW/'}
            target={'_blank'}
          >
            <p className={'text-xl text-white underline p-4'}>Pour tout savoir sur l’inscription</p>
          </a>
          <img
            src={'/inertia/images/news/3.jpg'}
            alt={'news image'}
            className={'absolute top-0 left-0 w-full h-full object-cover'}
          />
        </div>
      </div>
    </div>
  )
}
