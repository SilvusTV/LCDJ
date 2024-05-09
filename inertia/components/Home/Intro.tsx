import LCDJLogo from '#components/LCDJLogo'
import Wave from '~/components/SVG/Wave'
import { useApi } from '~/utils/ApiRequest'
import { useEffect, useState } from 'react'

export default function Intro() {
  const [links, setLinks] = useState<Array<string>>([])
  const { data: rawLink } = useApi('getLinks', { method: 'GET' })
  useEffect(() => {
    if (rawLink) {
      setLinks(rawLink)
    }
  }, [rawLink])
  return (
    <>
      <p>{links}</p>
      <div className={'flex min-h-screen w-10/12 self-center gap-20'}>
        <div className={'flex flex-col justify-center items-center w-2/5 gap-10'}>
          <LCDJLogo className={'h-1/12'} />
          <p className={'text-4xl font-bold text-center my-6'}>La Converse des Jeunes</p>
        </div>
        <div className={'text-3xl flex flex-col gap-4 justify-center w-3/5'}>
          <p>
            La Conserve des Jeunes est une association reconnue d’intérêt général œuvrant sur Paris.
          </p>
          <p>
            🎯<b>Nos objectifs ?</b> Lutter contre la précarité des jeunes et créer du lien social.
          </p>
          <p>
            📢<b>Nos actions ?</b> Des distributions de paniers solidaires gratuits à destination
            des jeunes de 18 à 25 ans au cours d'ateliers conviviaux et créatifs.
          </p>
          <div
            className={'flex justify-evenly my-6 text-xl gap-2 text-center items-center mb-10'}
            id={'intro-button'}
          >
            <a
              className={
                'bg-orange-light border-2 px-8 py-4 rounded-full border-orange-dark cursor-pointer'
              }
              href={'https://linktr.ee/laconservedesjeunes'}
              target={'_blank'}
            >
              Réserve ton panier
            </a>
            <a
              className={
                'bg-orange-light border-2 px-8 py-4 rounded-full border-orange-dark hover:bg-orange-dark transition-background-color cursor-pointer'
              }
              href={'https://tr.ee/Sy4vuVFgd2'}
              target={'_blank'}
            >
              Deviens bénévole
            </a>
            <a
              className={
                'bg-orange-light border-2 px-8 py-4 rounded-full border-orange-dark hover:bg-orange-dark transition-background-color cursor-pointer'
              }
              href={'https://tr.ee/2dBXXZutTF'}
              target={'_blank'}
            >
              Fais un don
            </a>
          </div>
        </div>
      </div>
      <Wave className={'fill-orange-dark'} />
    </>
  )
}
