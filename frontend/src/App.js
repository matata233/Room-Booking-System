import './App.css';
import { Routes, Route } from 'react-router-dom';
import AdminHomePage from './pages/AdminHomePage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/adminHomePage' element={<AdminHomePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
