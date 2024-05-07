import { Head } from '@inertiajs/react'
import Intro from '~/components/Home/Intro'
import Actus from '~/components/Home/Actus'
import Actions from '~/components/Home/Actions'

export default function Home() {
  return (
    <>
      <Head title="Homepage2" />
      <div className={'flex flex-col justify-center'}>
        <Intro />
        <Actus />
        <Actions />
      </div>
    </>
  )
}
