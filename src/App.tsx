import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import { TeamStats } from './pages/TeamStats';
import AuthSuccess from './pages/AuthSuccess'
import AuthError from './pages/AuthError'
import './App.css'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team/:id" element={<TeamStats />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/auth/error" element={<AuthError />} />
      </Routes>
    </Router>
  )
}

export default App
