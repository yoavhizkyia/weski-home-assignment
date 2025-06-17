import React from 'react'

import NavBar from './components/navbar/nav-bar'
import HotelList from './components/hotelList/hotelList'

const App: React.FC =() => {
  return (
    <div className='app'>
      <NavBar />
      <HotelList />
    </div>
  )
}

export default App
