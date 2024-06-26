export default function Blob(props: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={props.className}>
      <path
        fill="#FFF8E9"
        d="M35.8,-40.8C42.3,-29.3,40.7,-14.7,41.6,1C42.6,16.6,46.3,33.3,39.8,42.6C33.3,51.9,16.6,53.9,0.6,53.3C-15.4,52.6,-30.7,49.4,-45.3,40.1C-59.8,30.7,-73.5,15.4,-74,-0.6C-74.6,-16.5,-62,-33,-47.5,-44.5C-33,-56,-16.5,-62.6,-0.9,-61.7C14.7,-60.8,29.3,-52.4,35.8,-40.8Z"
        transform="translate(130 110) scale(1.5)"
      />
    </svg>
  )
}
