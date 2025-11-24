import Wave2 from '~/components/SVG/Wave2'
import { useApi } from '~/utils/ApiRequest'

interface Partner { id: number; name: string; url?: string | null; logoUrl?: string | null }

export default function Partners({ groupKey }: { groupKey?: string }) {
  const { data } = useApi<Partner[]>('getPartners', { method: 'GET', queryParams: groupKey ? { key: groupKey } : undefined })
  const partners: Partner[] = Array.isArray(data) ? data : []
  const hasDynamic = partners.length > 0

  return (
    <div className={'flex relative bg-blue-light min-h-screen flex-col items-center max-sm:min-h-0'}>
      <Wave2 className={'fill-orange-dark'} />
      <h1 className={'text-6xl text-center font-extrabold m-20 max-sm:text-5xl max-sm:m-8 '}>Nos Partenaires</h1>
      <div className={'w-3/5 flex flex-row items-center gap-10 justify-center flex-wrap mt-24 max-sm:w-full max-sm:p-8 max-sm:my-20'}>
        {hasDynamic ? (
          partners.map((p) => (
            <a key={p.id} href={p.url || '#'} target={p.url ? '_blank' : undefined} rel="noreferrer" title={p.name}>
              {p.logoUrl ? (
                <img src={p.logoUrl} alt={p.name} className={'partner-img'} />
              ) : (
                <div className={'partner-img flex items-center justify-center bg-white text-gray-700 font-medium px-4 py-2 rounded'}>
                  {p.name}
                </div>
              )}
            </a>
          ))
        ):<div className={'text-blue-200 mt-4 text-sm'}>Erreur lors du chargement des actus.</div>}
      </div>
    </div>
  )
}
