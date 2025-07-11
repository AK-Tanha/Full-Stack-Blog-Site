
import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './Component/Navbar'
import Footer from './Component/Footer'

function App() {

  return (
    <div className='bg-bgPrimary min-h-screen flex flex-col'>

      <Navbar />

      <div className='flex-grow'>
        <Outlet />
      </div>

      <div>
        <Footer/>
      </div>
      
    </div>
  )
}

export default App
