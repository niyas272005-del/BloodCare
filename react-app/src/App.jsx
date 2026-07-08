import './App.css'
import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import BottomNav from './components/BottomNav.jsx'
import ChatBot from './components/ChatBot.jsx'
import Toast from './components/Toast.jsx'
import Loader from './components/Loader.jsx'
import Home from './pages/Home.jsx'
import Donors from './pages/Donors.jsx'
import Hospitals from './pages/Hospitals.jsx'
import Community from './pages/Community.jsx'
import Emergency from './pages/Emergency.jsx'
import Education from './pages/Education.jsx'
import Register from './pages/Register.jsx'

function App() {
  // Theme persistence
  useEffect(() => {
    const saved = localStorage.getItem('bc-theme') || 'light'
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  return (
    <>
      <Loader />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donors" element={<Donors />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/community" element={<Community />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/education" element={<Education />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <BottomNav />
      <ChatBot />
      <Toast />
    </>
  )
}

export default App
