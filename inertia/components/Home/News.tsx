export default function News() {
  return (
    <div className={'h-screen bg-orange-dark flex flex-col items-center'}>
      <h1 className={'text-7xl text-center font-extrabold m-20 max-sm:text-5xl'}>Nos Actus</h1>
      <div className={'grid grid-cols-2 grid-rows-3 gap-10 h-1/2 w-4/5'}>
        <div className={'row-span-2 bg-red-400 max-sm:col-span-2 max-sm:row-span-2'}>1</div>
        <div className={'bg-amber-400 max-sm:row-start-3'}>2</div>
        <div className={'col-start-2 bg-blue-100 max-sm:row-start-3'}>3</div>
      </div>
    </div>
  )
}
