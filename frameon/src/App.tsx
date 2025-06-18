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
import Sobre from './Sobre';
import AdminDashboard from './admin/AdminDashboard';
import Landing from './Landing';
import { AdminRouter } from './AdminRouter';
import Favoritos from './Favoritos';
import Profile from './controller/aplicativo/Profile';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/usuario" element={<Cadastro/>}/>
          <Route path="" element={<Landing/>}/>

          <Route element={<ProtectedRoute/>}>
            <Route path="/home" element={<Home/>}/>
            <Route path="/favoritos" element={<Favoritos/>}/>
            <Route path="/sobre" element={<Sobre/>}/>
            <Route path="/perfil" element={<Profile/>}/>
            <Route path="/usuario/:id" element={<Cadastro/>}/>
          </Route>

          <Route element={<AdminRouter/>}>
            <Route path="/filme" element={<FilmeCadastro/>}/>
            <Route path="/filme/:id" element={<FilmeCadastro />} />
            <Route path="/lista-filmes" element={<FilmesPage/>}/>
            <Route path="/lista-usuario" element={<ListaUsers/>}/>
            <Route path="/admin" element={<AdminDashboard/>}/>
          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
