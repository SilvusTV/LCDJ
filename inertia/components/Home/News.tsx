import { useApi } from '~/utils/ApiRequest'

interface NewsItem { id: number; title: string; link: string; imageName?: string | null }

export default function News() {
  const { data, isLoading, error } = useApi<NewsItem[]>('getNews', { method: 'GET' })
  const items = data || []

  // Build 3 slots from items (fill with undefined if fewer than 3)
  const slots: (NewsItem | undefined)[] = [items[0], items[1], items[2]]

  return (
    <div className={'h-screen bg-orange-dark flex flex-col items-center'}>
      <h1 className={'text-6xl text-center font-extrabold m-20 max-sm:text-5xl'}>Nos Actus</h1>

      {isLoading ? (
        <div className={'grid sm:grid-cols-2 sm:grid-rows-2 sm:mb-52 gap-10 h-3/4 w-4/5 max-sm:grid-cols-1 max-sm:grid-rows-3'}>
          <div className={'sm:row-span-2 rounded-lg bg-black/10 animate-pulse'} />
          <div className={'rounded-lg bg-black/10 animate-pulse'} />
          <div className={'rounded-lg bg-black/10 animate-pulse sm:col-start-2'} />
        </div>
      ) : items.length === 0 ? (
        <div className={'text-white/80 mb-32'}>Aucune actu pour le moment.</div>
      ) : (
        <div className={'grid sm:grid-cols-2 sm:grid-rows-2 sm:mb-52 gap-10 h-3/4 w-4/5 max-sm:grid-cols-1 max-sm:grid-rows-3'}>
          {/* Big left tile (item 0) */}
          <Tile item={slots[0]} className={'sm:row-span-2'} />
          {/* Top-right tile (item 1) */}
          <Tile item={slots[1]} />
          {/* Bottom-right tile (item 2) */}
          <Tile item={slots[2]} className={'sm:col-start-2'} />
        </div>
      )}

      {error && <div className={'text-red-200 mt-4 text-sm'}>Erreur lors du chargement des actus.</div>}
    </div>
  )
}

function Tile({ item, className = '' }: { item?: NewsItem; className?: string }) {
  // If item is undefined (less than 3), render a subtle placeholder to keep layout
  if (!item) {
    return <div className={`relative overflow-hidden flex items-end rounded-lg bg-black/10 ${className}`} />
  }

  const hasImg = Boolean(item.imageName)

  return (
    <div className={`relative overflow-hidden flex items-end rounded-lg ${className}`}>
      <a
        className={'hover:tracking-widest hover-animation z-10 w-full h-full content-end bg-gradient-to-b from-transparent to-black from-40%'}
        href={item.link}
        target={'_blank'}
        rel={'noreferrer'}
        aria-label={item.title}
      >
        <p className={'text-xl text-white underline p-4 truncate'}>{item.title}</p>
      </a>
      {hasImg ? (
        <img src={item.imageName as string} alt={item.title} className={'absolute top-0 left-0 w-full h-full object-cover'} />
      ) : (
        <div className={'absolute top-0 left-0 w-full h-full bg-black/20'} />
      )}
    </div>
  )
}
