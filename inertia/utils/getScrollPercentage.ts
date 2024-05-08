import { useEffect, useState } from 'react'

interface ScrollPercentage {
  scrollYPosition: number
  scrollMaxY: number
  scrollPercentage: number
}

export default function getScrollPercentage() {
  const scrollMaxY = document.documentElement.scrollHeight - document.documentElement.clientHeight
  const [scrollYPosition, setScrollYPosition] = useState(0)
  const scrollPercentage = (scrollYPosition / scrollMaxY) * 100

  const handleScroll = () => {
    const newScrollYPosition = window.scrollY
    setScrollYPosition(newScrollYPosition)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  return {
    scrollYPosition,
    scrollMaxY,
    scrollPercentage,
  } as ScrollPercentage
}
