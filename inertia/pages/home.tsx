import { Head } from '@inertiajs/react'
import Intro from '~/components/Home/Intro'
import News from '~/components/Home/News'
import Actions from '~/components/Home/Actions'
import Insight from '~/components/Home/Insight'
import Partners from '~/components/Home/Partners'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import getScrollPercentage from '~/utils/getScrollPercentage'

export default function Home() {
  const { scrollPercentage } = getScrollPercentage()
  return (
    <>
      <Head title="La conserve des jeunes" />
      <div className={'flex flex-col justify-center'}>
        {scrollPercentage > 15 ? <Header /> : <Header className={'translate-y--100'} />}
        <Intro />
        <News />
        <Actions />
        <Insight />
        <Partners />
        <Footer />
      </div>
    </>
  )
}
