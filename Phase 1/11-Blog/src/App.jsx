import React from 'react'
import Card from './components/card'

const App = () => {
  return (
    <div className='h-screen w-screen bg-[#d6a68d] flex flex-col justify-center items-center '>
        <h1 className='text-3xl font-bold text-white '> Blog's</h1>
      <Card/>
    </div>
  )
}

export default App