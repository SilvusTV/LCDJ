import Wave2 from '~/components/SVG/Wave2'

export default function Actions() {
  return (
    <div className={'relative bg-blue-dark flex flex-col items-center'}>
      <Wave2 className={'fill-orange-dark'} />
      <h1
        className={
          'text-6xl text-center font-extrabold m-20 text-white max-sm:text-5xl max-sm:mx-8'
        }
      >
        Nos Actions
      </h1>
      <p className={'text-2xl text-justify w-3/5 text-white max-sm:w-full max-sm:p-8'}>
        Une volonté simple dicte nos actions : permettre aux jeunes de subvenir à leurs besoins
        alimentaires et hygiéniques de base gratuitement. C'est comme ça qu'est né le projet «
        renfloue ton placard ».
      </p>
      <div
        className={
          'grid grid-cols-2 grid-rows-2 gap-4 w-10/12 mt-10 mb-40 ' +
          'max-sm:w-full max-sm:p-8 max-sm:mb-8 max-sm:grid-cols-1 max-sm:flex-col max-sm:gap-8'
        }
      >
        <div
          className={'relative flex content-center justify-center items-center max-sm:row-start-1'}
        >
          <img
            src={'/inertia/images/Actions/1.png'}
            alt={'1'}
            className={'absolute h-32 top-2 left-0 transform-translate max-sm:hidden'}
          />
          <p className={`text-xl text-justify bg-orange-light p-10 rounded-xlg`}>
            La première étape consiste à collecter une fois par mois les denrées alimentaires et
            produits d’hygiène auprès des clients des supermarchés partenaires, et à l'aide de nos
            bénévoles
          </p>
        </div>
        <div className={'col-start-1 row-start-2 flex items-center justify-center'}>
          <img src={'/inertia/images/Actions/Map2.png'} alt={'Carte 2'} className={'h-72'} />
        </div>
        <div
          className={
            'col-start-2 row-start-1 max-sm:col-start-1 max-sm:row-start-4 flex justify-center items-center'
          }
        >
          <img src={'/inertia/images/Actions/Map1.png'} alt={'Carte 1'} className={'h-72'} />
        </div>
        <div
          className={
            'relative flex content-center justify-center items-center max-sm:col-start-1 max-sm:row-start-3'
          }
        >
          <img
            src={'/inertia/images/Actions/2.png'}
            alt={'2'}
            className={'absolute h-32 top-0 right-0 transform-translate max-sm:hidden'}
          />
          <p className={'text-xl text-justify bg-orange-light p-10 rounded-xlg'}>
            Les paniers sont ensuite distribués au cours de distributions aux jeunes de 18 à 25 ans
            préalablement inscrits. Nous en organisons deux par mois, dans le 9e et 18e
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
