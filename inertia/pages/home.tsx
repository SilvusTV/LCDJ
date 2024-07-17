import { Head } from '@inertiajs/react'
import Intro from '~/components/Home/Intro'
import News from '~/components/Home/News'
import Actions from '~/components/Home/Actions'
import Insight from '~/components/Home/Insight'
import Partners from '~/components/Home/Partners'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import getScrollPercentage from '~/utils/getScrollPercentage'
import { useEffect, useState } from 'react'
import { useApi } from '~/utils/ApiRequest'
import { TLinks } from '../../app/Types/TLinks'
import { isSmartphone } from '~/utils/getDevice'
import PhoneHeader from '~/components/PhoneHeader'
import LOGO from '/inertia/images/LOGO.png'

export default function Home() {
  const { scrollPercentage } = getScrollPercentage()
  const [links, setLinks] = useState<any>([])

  const { data: rawLink } = useApi<TLinks>('getLinks', { method: 'GET' })
  useEffect(() => {
    if (rawLink) {
      setLinks(rawLink)
    }
  }, [rawLink])

  return (
    <>
      <Head>
        <title>La conserve des jeunes</title>
        <link rel="icon" href={LOGO} />
      </Head>
      <div className={'flex flex-col justify-center'}>
        {isSmartphone() ? (
          <PhoneHeader links={links} />
        ) : scrollPercentage > 15 ? (
          <Header links={links} />
        ) : (
          <Header className={'translate-y--100'} links={links} />
        )}
        <Intro links={links} />
        <News />
        <Actions />
        <Insight />
        <Partners />
        <Footer links={links} />
      </div>
    </>
  )
}
