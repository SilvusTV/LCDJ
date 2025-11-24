import LCDJLogo from '#components/LCDJLogo'
import Wave from '~/components/SVG/Wave'
import { TLinks } from '../../../app/Types/TLinks'

export default function Intro(props: { links: TLinks[] }) {
  return (
    <>
      <div
        className={
          'flex min-h-screen w-10/12 self-center gap-10 max-sm:flex-col max-sm:w-full max-sm:p-8'
        }
      >
        <div
          className={
            'flex flex-col justify-center items-center w-2/5 gap-10 max-sm:w-full max-sm:mt-5'
          }
        >
          <LCDJLogo className={'h-1/12'} />
          <p className={'text-4xl font-bold text-center mt-6'}>La Conserve des Jeunes</p>
        </div>
        <div className={'text-3xl flex flex-col gap-4 justify-center w-3/5 max-sm:w-full'}>
          <p>
            La Conserve des Jeunes est une association reconnue d’intérêt général œuvrant à Paris.
          </p>
          <p>
            🎯 <b>Nos objectifs ?</b> Lutter contre la précarité des jeunes et créer du lien social.
          </p>
          <p>
            📢 <b>Nos actions ?</b> Des distributions de paniers solidaires gratuits à destination
            des jeunes de 18 à 30 ans au cours d'ateliers conviviaux et créatifs à partir de
            produits collectés en supermarchés.
          </p>
          <div
            className={'flex justify-evenly my-6 text-xl gap-2 text-center items-center mb-10'}
            id={'intro-button'}
          >
            {props.links.map((link: TLinks) => {
              return (
                <a
                  className={
                    'bg-orange-light border-2 px-8 py-4 rounded-full border-orange-dark cursor-pointer max-sm:py-1 max-sm:px-2 primary-btn text-lg'
                  }
                  href={link.url}
                  target={'_blank'}
                >
                  {link.title}
                </a>
              )
            })}
          </div>
        </div>
      </div>
      <Wave className={'fill-orange-dark max-sm:p-32'} />
    </>
  )
}
