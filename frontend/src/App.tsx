import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/login/Login';
import SelectLanguage from './pages/selectlanguage/SelectLanguage';
import VideoCall from './pages/videocall/VideoCall';

import {BrowserRouter as Router} from 'react-router-dom'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/selectLanguage" element={<SelectLanguage/>} />
        <Route path="/videoCall" element={<VideoCall/>} />
      </Routes>
    </Router>
  );
}

export default App;