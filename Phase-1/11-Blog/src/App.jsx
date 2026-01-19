import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Card from './components/cardList'
import Profile from './components/profile'
const App = () => {
  return (
    <Router>
    <div className=' h-full w-full bg-[#d6a68d] flex flex-col justify-center items-center overflow-x-hidden'>
        <h1 className='mt-8 text-3xl font-bold text-white '> Blog's</h1>
        <Routes>
              <Route path='/' element={<Card/>} />
              <Route path='/profile/:name'element={<Profile/>} />
        </Routes>
    </div>
    </Router>
  )
}

export default App