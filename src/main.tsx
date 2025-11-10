import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'
import MapORS from './components/MapORS.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MapORS/>
  </StrictMode>,
)
