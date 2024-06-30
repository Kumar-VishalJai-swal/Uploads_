import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './container/Home';
import { useEffect } from 'react';
import { gapi } from 'gapi-script';
import './App.css';

const App = () => {
  useEffect(() => {
    function start(){
      gapi.client.init({
        clientId:process.env.REACT_APP_GOOGLE_API_TOKEN,
        scope: ""
      })
    };
    gapi.load('client:auth2', start);
  });
  
  return (
    <Routes>
      <Route path='login' element={<Login />}/>
      <Route path='/*' element={<Home />}/>
    </Routes>
  )
}

export default App