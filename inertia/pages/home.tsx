import { Head } from '@inertiajs/react'
import Intro from '~/components/Home/Intro'
import News from '~/components/Home/News'
import Actions from '~/components/Home/Actions'
import Insight from '~/components/Home/Insight'
import Partners from '~/components/Home/Partners'

export default function Home() {
  return (
    <>
      <Head title="La conserve des jeunes" />
      <div className={'flex flex-col justify-center'}>
        <Intro />
        <News />
        <Actions />
        <Insight />
        <Partners />
      </div>
    </>
  )
}
