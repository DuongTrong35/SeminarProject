import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// AOS scroll animations
import AOS from 'aos'
import 'aos/dist/aos.css'

AOS.init({
  once: true,
  duration: 800,
  easing: 'ease-in-out',
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
