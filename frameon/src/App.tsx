import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import ListaUsers from './controller/aplicativo/ListaUsers';
import Cadastro from './controller/aplicativo/Cadastro';
import FilmeCadastro from './controller/aplicativo/FilmeCadastro';
import Login from './login/Login';
import Home from './Home';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './App.css';
import FilmesPage from './controller/aplicativo/FilmesPage';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/usuario" element={<Cadastro/>}/>
          <Route path="/filme" element={<FilmeCadastro/>}/>
          <Route path="/filme/:id" element={<FilmeCadastro />} />
          <Route path="/lista-filmes" element={<FilmesPage/>}/>

          <Route element={<ProtectedRoute/>}/>
            <Route path="/" element={<Home/>}/>
            <Route path="/usuario/:id" element={<Cadastro/>}/>
            <Route path="/lista-usuario" element={<ListaUsers/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
