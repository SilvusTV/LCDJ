import Wave2 from '~/components/SVG/Wave2'
import AnimatedNumber from '~/components/AnimatedNumber'
import getScrollPercentage from '~/utils/getScrollPercentage'
import { useEffect, useState } from 'react'

export default function Insight() {
  const { scrollPercentage } = getScrollPercentage()
  const [scrollMax, setScrollMax] = useState(0)
  useEffect(() => {
    if (scrollMax < scrollPercentage) {
      setScrollMax(scrollPercentage)
    }
  }, [scrollPercentage])
  return (
    <div className={'min-h-screen relative bg-orange-dark flex flex-col items-center'}>
      <Wave2 className={'fill-blue-dark'} />
      <h1 className={'text-6xl text-center font-extrabold m-20 mt-40 max-sm:text-5xl max-sm:m-8'}>
        Nos Chiffres clés
      </h1>
      <div className={'w-screen flex justify-center mt-32 max-sm:my-10 max-lg:mb-52'}>
        <div className="grid grid-cols-5 grid-rows-2 gap-10 w-3/4 text-center justify-items-center max-sm:w-full max-sm:p-8 max-sm:grid-rows-5 max-sm:grid-cols-1">
          <div className={'flex flex-col gap-7 w-fit'}>
            <p className={'text-8xl font-bold '}>
              {scrollMax > 63 ? <AnimatedNumber n={414} /> : 414}
            </p>
            <p className={'text-2xl'}>Paniers distribués</p>
          </div>
          <div
            className={
              'flex flex-col gap-7 max-lg:col-start-2 max-lg:row-start-2 max-sm:col-start-1 max-sm:row-start-2  w-fit'
            }
          >
            <p className={'text-8xl font-bold'}>{scrollMax > 63 ? <AnimatedNumber n={3} /> : 3}</p>
            <p className={'text-2xl'}>Tonnes de produits collectés</p>
          </div>
          <div
            className={
              'flex flex-col gap-7 max-lg:col-start-3 max-sm:col-start-1 max-sm:row-start-3 w-fit'
            }
          >
            <p className={'text-8xl font-bold'}>{scrollMax > 63 ? <AnimatedNumber n={7} /> : 7}</p>
            <p className={'text-2xl col-start-3 row-start-2'}>Ateliers culturels réalisés</p>
          </div>
          <div
            className={
              'flex flex-col gap-7 max-lg:col-start-4 max-lg:row-start-2 max-sm:col-start-1 max-sm:row-start-4 w-fit'
            }
          >
            <p className={'text-8xl font-bold'}>
              {scrollMax > 63 ? <AnimatedNumber n={14} /> : 14}
            </p>
            <p className={'text-2xl'}>Distrtibution organisées</p>
          </div>
          <div
            className={
              'flex flex-col gap-7 max-lg:col-start-5 max-sm:col-start-1 max-sm:row-start-5 w-fit'
            }
          >
            <p className={'text-8xl font-bold'}>
              {scrollMax > 63 ? <AnimatedNumber n={65} /> : 65}
            </p>
            <p className={'text-2xl'}>Bénévoles mobilisés</p>
          </div>
        </div>
      </div>
    </div>
  )
}
