import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  Filme } from './model/Filme.model';
import { ProtectedRoute } from './ProtectedRoute';
import ListaUsers from './controller/aplicativo/ListaUsers';
import Cadastro from './FilmeCadastro';
import Login from './login/Login';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/login" element={<Login/>}/>

          <Route element={<ProtectedRoute/>}/>
            <Route path="/usuario" element={<Cadastro/>}/>
            <Route path="/usuario/:id" element={<Cadastro/>}/>
            <Route path="/lista-usuario" element={<ListaUsers/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
