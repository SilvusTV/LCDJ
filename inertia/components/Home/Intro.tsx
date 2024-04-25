import LCDJLogo from '#components/LCDJLogo'
import Button from '~/components/Button'
import Wave from '~/components/SVG/Wave'

export default function Intro() {
  return (
    <>
      <div className={'flex h-screen w-10/12 self-center gap-20'}>
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
          <div className={'flex justify-evenly my-6 text-xl'}>
            <Button>Réserve ton panier</Button>
            <Button>Deviens bénévole</Button>
            <Button>Fais un don</Button>
          </div>
        </div>
      </div>
      <Wave />
    </>
  )
}
