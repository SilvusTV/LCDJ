export default function Footer() {
  return (
    <div className={'bg-orange-light flex my-6 gap-10 justify-around'}>
      <div className={'flex flex-col gap-0.5'}>
        <h2 className={'font-bold mb-4'}>Liens utile</h2>
        <a href="">Réserve ton panier</a>
        <a href="">Deviens bénévole</a>
        <a href="">Fais un don</a>
        <a href="">Mentions légale</a>
      </div>
      <div className={'flex flex-col gap-0.5'}>
        <h2 className={'font-bold mb-4'}>Nos réseaux Sociaux</h2>
        <a href="">Instagram</a>
        <a href="">Facebook</a>
        <a href="">Linkedin</a>
        <a href="">TikTok</a>
      </div>
      <div className={'flex flex-col gap-0.5'}>
        <h2 className={'font-bold mb-4'}>Nous Contacter</h2>
        <a href="">example@mail.com</a>
        <a href="">010203040506</a>
        <a href="">adresse</a>
      </div>
    </div>
  )
}
