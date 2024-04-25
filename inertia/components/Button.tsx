import { forwardRef, MouseEventHandler } from 'react'
import clsx from 'clsx'

interface ButtonProps {
  children: any
  onClick?: MouseEventHandler<HTMLButtonElement>
  className?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props) => {
  const css = clsx(
    'bg-orange-light border-2 px-8 py-4 rounded-full border-orange-dark',
    props.className,
    'hover:bg-orange-dark'
  )
  return (
    <>
      <button className={css} onClick={props.onClick}>
        {props.children}
      </button>
    </>
  )
})
export default Button
