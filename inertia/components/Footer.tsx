import { TLinks } from '../../app/Types/TLinks'
import { useApi } from '~/utils/ApiRequest'

interface SocialLink { title: string; url: string }
interface ContactInfo { email?: string; address?: string; city?: string; country?: string; phone?: string }

export default function Footer(props: { links: TLinks[] }) {
  const { data: socials } = useApi<SocialLink[]>('getSocialNetworks', { method: 'GET' })
  const { data: contact } = useApi<ContactInfo>('getContacts', { method: 'GET' })

  const addressParts = contact ? [contact.address, contact.city, contact.country].filter(Boolean).join(', ') : ''
  const mapsUrl = 'https://www.google.com/maps/place/La+conserve+des+Jeunes/@48.8810495,2.3334594,954m/data=!3m2!1e3!4b1!4m6!3m5!1s0x47e66f0046a623a5:0x141ea6afc53076!8m2!3d48.8810495!4d2.3360343!16s%2Fg%2F11wb38r9kg?entry=ttu&g_ep=EgoyMDI1MTAwNy4wIKXMDSoASAFQAw%3D%3D'

  return (
    <div
      className={
        'bg-orange-light flex my-6 gap-10 justify-evenly max-sm:flex-col max-sm:text-center max-sm:self-center'
      }
    >
      <div className={'flex flex-col justify-center items-center flex-wrap gap-5'}>
        <img
          src={'/inertia/images/LOGO.webp'}
          alt={'Logo La Conserve Des Jeunes'}
          className={'h-20'}
        />
        <h1 className={'text-l font-bold text-center'}>La Conserve des Jeunes</h1>
      </div>
      <div className={'flex flex-col gap-0.5 w-2/12 flex-wrap items-start max-sm:w-full'}>
        <h2 className={'font-bold mb-4'}>Liens utiles</h2>
        {props.links.map((link: TLinks, idx: number) => {
          return (
            <a key={idx} href={link.url} target={'_blank'} className={'animate-underline'}>
              {link.title}
            </a>
          )
        })}
        <a href="/mentionslegales" className={'animate-underline'}>
          Mentions légales
        </a>
        <a href="/cgu" className={'animate-underline'}>
          CGU
        </a>
      </div>
      <div className={'flex flex-col gap-0.5 w-2/12 flex-wrap items-start max-sm:w-full'}>
        <h2 className={'font-bold mb-4'}>Nos réseaux sociaux</h2>
        {(socials || []).map((s, idx) => (
          <a key={idx} className={'animate-underline'} href={s.url} target={'_blank'}>
            {s.title}
          </a>
        ))}
      </div>
      <div
        className={'flex flex-col gap-0.5 min-w-2/12 flex-wrap text-wrap items-start max-sm:w-full'}
      >
        <h2 className={'font-bold mb-4'}>Nous contacter</h2>
        {contact?.email && (
          <a className={'animate-underline'} href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
        )}
        <div className={'text-left'}>
          {(contact?.address || contact?.city || contact?.country) && (
            <a
              className={'animate-underline'}
              href={mapsUrl}
              target={'_blank'}
              rel="noopener noreferrer"
              title="Ouvrir dans Google Maps"
            >
              {contact?.address}
              {(contact?.city || contact?.country) && (
                <>
                  <br />
                  <span>
                    {contact?.city || ''}{contact?.city && contact?.country ? ', ' : ''}{contact?.country || ''}
                  </span>
                </>
              )}
            </a>
          )}
          {contact?.phone && <div>{contact.phone}</div>}
        </div>
      </div>
    </div>
  )
}
