import Wave2 from '~/components/SVG/Wave2'
import AnimatedNumber from '~/components/AnimatedNumber'
import getScrollPercentage from '~/utils/getScrollPercentage'
import { useEffect, useState } from 'react'
import { useApi } from '~/utils/ApiRequest'

interface KeyFigure { id: number; title: string; value: number }

export default function Insight() {
  const { scrollPercentage } = getScrollPercentage()
  const [scrollMax, setScrollMax] = useState(0)

  const { data, isLoading, error } = useApi<KeyFigure[]>('getKeyFigures', { method: 'GET' })
  const items = data || []

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
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 w-3/4 text-center justify-items-center max-sm:w-full max-sm:p-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={'flex flex-col gap-7 w-fit'}>
                <div className={'h-20 w-40 rounded-lg bg-black/10 animate-pulse mx-auto'} />
                <div className={'h-6 w-56 rounded bg-black/10 animate-pulse mx-auto'} />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-white/80">Aucun chiffre clé pour le moment.</div>
        ) : (
          <div className="flex justify-items-center max-sm:w-full max-sm:p-8 gap-8">
            {items.map((k) => (
              <div key={k.id} className={'flex flex-col gap-7 items-center w-60 text-center'}>
                <p className={'text-8xl font-bold'}>
                  {scrollMax > 63 ? (
                    <AnimatedNumber n={k.value} />
                  ) : (
                    k.value.toLocaleString('fr-FR')
                  )}
                </p>
                <p className={'text-2xl'}>{k.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <div className={'text-red-200 mt-4 text-sm'}>Erreur lors du chargement des chiffres clés.</div>}
    </div>
  )
}
