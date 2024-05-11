import Wave2 from '~/components/SVG/Wave2'

export default function Actions() {
  return (
    <div className={'relative bg-blue-dark flex flex-col items-center'}>
      <Wave2 className={'fill-orange-dark'} />
      <h1 className={'text-6xl text-center font-extrabold m-20 mt-0 text-white'}>Nos Actions</h1>
      <p className={'text-2xl text-justify w-2/5 text-white'}>
        Une volonté simple dicte nos actions : permettre aux jeunes de subvenir à leurs besoins
        alimentaires et hygiéniques de base gratuitement. C'est comme ça qu'est né le projet
        "renfloue ton placard".
      </p>
      <div className={'grid grid-cols-2 grid-rows-2 gap-4 w-10/12 mt-10 mb-40'}>
        <div className={'relative flex content-center justify-center items-center'}>
          <img
            src={'/inertia/images/1.png'}
            alt={'1'}
            className={'absolute h-32 top-10 left-0 transform-translate'}
          />
          <p className={`text-2xl text-center bg-orange-light p-10 rounded-xlg`}>
            La première étape consiste à collecter une fois par mois les denrées alimentaires et
            produits d’hygiène en supermarché auprès des clients des supermarchés et à l'aide de nos
            bénévoles. Ces dons constituent ensuite les paniers distribués, composés d'une dizaine
            de produits alimentaires et d'hygiène.
          </p>
        </div>
        <div className={'col-start-1 row-start-2'}></div>
        <div className={'col-start-2 row-start-1'}></div>
        <div className={'relative flex content-center justify-center items-center'}>
          <img
            src={'/inertia/images/2.png'}
            alt={'2'}
            className={'absolute h-32 top-0 right-0 transform-translate'}
          />
          <p className={'text-2xl text-center bg-orange-light p-10 rounded-xlg'}>
            Les paniers sont ensuite distribués aux jeunes de 18 à 25 ans préalablement inscrits au
            cours de distributions. Nous en organisons deux par mois, dans le 9e et 18e
            arrondissement de Paris.
            <br /> <br />
            Notre objectif est de lutter contre la précarité des jeunes, mais également de créer du
            lien social. C'est pourquoi nous organisons, au cours des distributions, des ateliers
            culturels et créatifs (graffiti, scène ouverte, peinture, poterie, yoga, etc.) ouverts à
            tous et gratuits.
          </p>
        </div>
      </div>
    </div>
  )
}
