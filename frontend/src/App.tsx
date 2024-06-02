import React, {useEffect, useState} from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { getUser } from './lib/api';
import { User } from './lib/interfaces';
import Login from './pages/login/Login';
import VideoCall from './pages/videocall/VideoCall';
import CreateAccount from './pages/createaccount/CreateAccount';

import {BrowserRouter as Router} from 'react-router-dom'
import Dashboard from './pages/dashboard/Dashboard';

const App: React.FC = () => {


  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createaccount" element={<CreateAccount />}/>
      </Routes>
    </Router>
  );
}

export default App;