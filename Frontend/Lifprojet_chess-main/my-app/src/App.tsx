import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Referee from './components/Referee/Referee';
import Homepage from './components/homepage';
import LandingPage from './components/Landingpage';
import PrivateRouteWrapper from './components/PrivateRouteWrapper';
import JoinGame from './components/JoinGame';
import Game from './components/Game';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/referee/:roomId" element={<PrivateRouteWrapper component={Referee} />} />
          <Route path="/homepage" element={<PrivateRouteWrapper component={Homepage} />} />
          <Route path="/game/:roomId" element={<PrivateRouteWrapper component={Game} />} />
          <Route path="/join/:roomId" element={<PrivateRouteWrapper component={JoinGame} />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

