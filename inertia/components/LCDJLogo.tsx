import LOGO from '/inertia/images/LOGO.webp'
export default function LCDJLogo(props: { className?: string }) {
  return (
    <>
      <img src={LOGO} className={props.className} alt="Logo de la conserve des jeunes" />
    </>
  )
}
