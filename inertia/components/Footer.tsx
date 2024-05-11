import { useEffect, useState } from 'react'
import { useApi } from '~/utils/ApiRequest'
import { TLinks } from '../../app/Types/TLinks'

export default function Footer() {
  const [links, setLinks] = useState<any>([])
  const { data: rawLink } = useApi<TLinks>('getLinks', { method: 'GET' })
  useEffect(() => {
    if (rawLink) {
      setLinks(rawLink)
    }
  }, [rawLink])
  return (
    <div
      className={
        'bg-orange-light flex my-6 gap-10 justify-evenly max-sm:flex-col max-sm:text-center'
      }
    >
      <div className={'flex flex-col justify-center items-center flex-wrap gap-5'}>
        <img
          src={'/inertia/images/LOGO.png'}
          alt={'Logo La Conserve Des Jeunes'}
          className={'h-20'}
        />
        <h1 className={'text-xl font-bold text-center'}>La Conserve Des Jeunes</h1>
      </div>
      <div className={'flex flex-col gap-0.5 w-2/12 flex-wrap max-sm:w-full'}>
        <h2 className={'font-bold mb-4'}>Liens utile</h2>
        {links.map((link: TLinks) => {
          return (
            <a href={link.url} target={'_blank'}>
              {link.title}
            </a>
          )
        })}
        <a href="">Mentions légale</a>
      </div>
      <div className={'flex flex-col gap-0.5 w-2/12 flex-wrap max-sm:w-full'}>
        <h2 className={'font-bold mb-4'}>Nos réseaux Sociaux</h2>
        <a
          href="https://www.instagram.com/laconservedesjeunes?igsh=eDAyNXdqam94OXEy"
          target={'_blank'}
        >
          Instagram
        </a>
        <a href="https://www.facebook.com/profile.php?id=61557393121421" target={'_blank'}>
          Facebook
        </a>
        <a href="https://www.linkedin.com/company/la-conserve-des-jeunes/" target={'_blank'}>
          Linkedin
        </a>
        <a href="https://www.tiktok.com/@laconservedesjeunes?_t=8mBS7aOCinp&_r=1" target={'_blank'}>
          TikTok
        </a>
      </div>
      <div className={'flex flex-col gap-0.5 min-w-2/12 flex-wrap text-wrap max-sm:w-full'}>
        <h2 className={'font-bold mb-4'}>Nous Contacter</h2>
        <a href="mailto:laconservedesjeunes@gmail.com">laconservedesjeunes@gmail.com</a>
        <a href="tel:0777820536">07-77-82-05-36</a>
        <a href="https://www.google.fr/maps/place/54+Rue+Jean-Baptiste+Pigalle,+75009+Paris/@48.8810495,2.3334594,17z/data=!3m1!4b1!4m6!3m5!1s0x47e66e460f902e05:0xd5e76520c035493d!8m2!3d48.8810495!4d2.3360343!16s%2Fg%2F11c5fkkwsy?entry=ttu">
          54 rue Jean-Baptiste Pigalle,
          <br /> 75009 Paris
        </a>
      </div>
    </div>
  )
}
