// src/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import FilmesPage from './FilmesPage';
import Cadastro from './Cadastro';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<FilmesPage />} />
      <Route path="/cadastro" element={<Cadastro />} />
    </Routes>
  );
}

export default AppRoutes;
