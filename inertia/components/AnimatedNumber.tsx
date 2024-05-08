import { useSpring, animated } from 'react-spring'

export default function AnimatedNumber(props: { n: number }) {
  const { number } = useSpring({
    from: { number: 0 },
    number: props.n,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 },
  })

  return <animated.span>{number.to((n) => n.toFixed(0))}</animated.span>
}
