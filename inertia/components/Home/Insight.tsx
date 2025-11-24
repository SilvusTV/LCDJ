import Wave2 from '~/components/SVG/Wave2'
import AnimatedNumber from '~/components/AnimatedNumber'
import getScrollPercentage from '~/utils/getScrollPercentage'
import { useEffect, useRef, useState } from 'react'
import { useApi } from '~/utils/ApiRequest'

interface KeyFigure { id: number; title: string; value: number; unit?: string | null }

/**
 * Formateur: insère des points pour séparer les milliers.
 * - 1234567 => "1.234.567"
 * - Gère aussi les nombres négatifs (ex: -12000 => "-12.000").
 * - Les décimales sont ignorées (arrondi à l'entier), cohérent avec l'animation en entier.
 */
function formatThousandsDot(n: number): string {
  const sign = n < 0 ? '-' : ''
  const int = Math.abs(Math.trunc(n))
  return sign + int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

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
          <div className="flex flex-wrap justify-center justify-items-center max-sm:w-full max-sm:p-8 gap-10">
            {items.map((k) => (
              <KeyFigureItem key={k.id} k={k} scrollMax={scrollMax} />
            ))}
          </div>
        )}
      </div>

      {error && <div className={'text-red-200 mt-4 text-sm'}>Erreur lors du chargement des chiffres clés.</div>}
    </div>
  )
}

function KeyFigureItem({
  k,
  scrollMax,
}: {
  k: { id: number; title: string; value: number; unit?: string | null }
  scrollMax: number
}) {
  const numberRef = useRef<HTMLDivElement | null>(null)
  const [measuredWidth, setMeasuredWidth] = useState<number | null>(null)

  useEffect(() => {
    const el = numberRef.current
    if (!el) return

    // Measure width and update on any size change
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.ceil(entry.contentRect.width)
        if (!Number.isNaN(w)) setMeasuredWidth(w)
      }
    })
    ro.observe(el)

    // Initial measure (in case ResizeObserver doesn’t fire immediately)
    const rect = el.getBoundingClientRect()
    if (rect.width) setMeasuredWidth(Math.ceil(rect.width))

    return () => {
      ro.disconnect()
    }
  }, [k.value, k.unit])

  return (
    <div
      className={
        'flex flex-col gap-7 items-center text-center inline-flex min-w-[15rem]'
      }
      style={{ width: measuredWidth ? `${measuredWidth}px` : undefined, minWidth: '15rem' }}
    >
      <div
        ref={numberRef}
        className={'text-8xl font-bold inline-flex items-end justify-center whitespace-nowrap'}
      >
        <span className="inline-block">
          {scrollMax > 63 ? (
            <AnimatedNumber n={k.value} format={formatThousandsDot} />
          ) : (
            formatThousandsDot(k.value)
          )}
        </span>
        {k.unit ? (
          <span className={'ml-2 font-extrabold leading-none'} style={{ fontSize: '0.5em' }}>
            {k.unit}
          </span>
        ) : null}
      </div>
      <p className={'text-2xl w-full break-words'}>{k.title}</p>
    </div>
  )
}
