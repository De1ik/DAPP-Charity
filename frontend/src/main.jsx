import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { CreateJarPage } from './pages/CreateJar.jsx'
import App from './App.jsx'
import { RegisterPage } from './pages/RegisterPage.jsx'
import { CharitiesJarsPage } from './pages/CharitiesJars.jsx'
import { UserProfile } from './pages/UserProfile.jsx'
import DonationJar from './pages/JarDescription.jsx'
import { WalletProvider } from './context/Wallet.jsx'
import { AboutPage } from './pages/AboutPage.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WalletProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path='/jars' element={<CharitiesJarsPage />} />
          <Route path="/create-jar" element={<CreateJarPage />} />
          <Route path='/profile' element={<UserProfile />} />
          <Route path='/jarDescription' element={<DonationJar/>}/>
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  </StrictMode>
)