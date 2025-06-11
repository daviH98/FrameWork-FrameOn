import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import ListaUsers from './controller/aplicativo/ListaUsers';
import Cadastro from './controller/aplicativo/Cadastro';
import Login from './login/Login';
import Home from './Home';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/usuario" element={<Cadastro/>}/>

          <Route element={<ProtectedRoute/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/usuario/:id" element={<Cadastro/>}/>
            <Route path="/lista-usuario" element={<ListaUsers/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
