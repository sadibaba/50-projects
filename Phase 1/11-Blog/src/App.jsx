import React from 'react'
import Card from './components/cardList'

const App = () => {
  return (
    <div className=' h-full w-full bg-[#d6a68d] flex flex-col justify-center items-center overflow-x-hidden'>
        <h1 className='mt-8 text-3xl font-bold text-white '> Blog's</h1>
      <Card/>
    </div>
  )
}

export default App