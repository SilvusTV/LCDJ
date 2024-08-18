export default function News() {
  return (
    <div className={'h-screen bg-orange-dark flex flex-col items-center'}>
      <h1 className={'text-6xl text-center font-extrabold m-20 max-sm:text-5xl'}>Nos Actus</h1>
      <div className={'grid grid-cols-2 grid-rows-3 gap-10 h-3/4 w-4/5'}>
        <a
          className={
            'row-span-2 bg-[url(/inertia/images/news-1.webp)] bg-center bg-cover bg-no-repeat max-sm:col-span-2 max-sm:row-span-2 flex items-end hover:tracking-widest hover-animation'
          }
          href={'#'}
        >
          <p className={'text-xl text-white underline p-4'}>Nos actions du mois</p>
        </a>
        <a
          className={
            'bg-[url(/inertia/images/news-2.webp)] bg-center bg-cover bg-no-repeat max-sm:row-start-3 flex items-end hover:tracking-widest hover-animation'
          }
          href={'https://www.instagram.com/reel/C0uXf3SrIlJ/'}
          target={'_blank'}
        >
          <p className={'text-xl text-white underline p-4'}>
            Envie d’en voir plus ? Retour sur le Festisol
          </p>
        </a>
        <a
          className={
            'bg-[url(/inertia/images/news-3.webp)] bg-center bg-cover bg-no-repeat col-start-2 max-sm:row-start-3 flex items-end hover:tracking-widest hover-animation'
          }
          href={'https://www.instagram.com/p/C1opJs6rscW/'}
          target={'_blank'}
        >
          <p className={'text-xl text-white underline p-4'}>Pour tout savoir sur l’inscription</p>
        </a>
      </div>
    </div>
  )
}
