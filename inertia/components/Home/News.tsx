export default function News() {
  return (
    <div className={'h-screen bg-orange-dark flex flex-col items-center'}>
      <h1 className={'text-6xl text-center font-extrabold m-20'}>Nos Actus</h1>
      <div className={'grid grid-cols-2 grid-rows-2 gap-10 h-1/2 w-4/5'}>
        <div className={'row-span-2 bg-red-400'}>1</div>
        <div className={'bg-amber-400'}>2</div>
        <div className={'col-start-2 bg-blue-100'}>3</div>
      </div>
    </div>
  )
}
