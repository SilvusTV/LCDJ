import { Head } from '@inertiajs/react'
import Intro from '~/components/Home/Intro'

export default function Home() {
  return (
    <>
      <Head title="Homepage2" />
      <div className={'flex flex-col justify-center'}>
        <Intro />
      </div>
    </>
  )
}
