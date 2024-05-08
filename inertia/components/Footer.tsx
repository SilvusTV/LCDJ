export default function Footer() {
  return (
    <div className={'bg-orange-light flex my-6 gap-10 justify-evenly'}>
      <div className={'flex flex-col justify-center items-center w-2/12 flex-wrap gap-5'}>
        <img
          src={'/inertia/images/LOGO.png'}
          alt={'Logo La Conserve Des Jeunes'}
          className={'h-20'}
        />
        <h1 className={'text-xl font-bold text-center'}>La Conserve Des Jeunes</h1>
      </div>
      <div className={'flex flex-col gap-0.5 w-2/12 flex-wrap'}>
        <h2 className={'font-bold mb-4'}>Liens utile</h2>
        <a href="">Réserve ton panier</a>
        <a href="">Deviens bénévole</a>
        <a href="">Fais un don</a>
        <a href="">Mentions légale</a>
      </div>
      <div className={'flex flex-col gap-0.5 w-2/12 flex-wrap'}>
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
      <div className={'flex flex-col gap-0.5 min-w-2/12 flex-wrap text-wrap'}>
        <h2 className={'font-bold mb-4'}>Nous Contacter</h2>
        <a href="mailto:laconservedesjeunes@gmail.com">laconservedesjeunes@gmail.com</a>
        <a href="">010203040506</a>
        <a href="">adresse</a>
      </div>
    </div>
  )
}
