// src/Home.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filme } from './model/Filme.model';

function Home() {
  const [filmes, setFilmes] = useState([]);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const armazenados = JSON.parse(localStorage.getItem('filmes')  || '{}');
    setFilmes(armazenados);
  }, []);

  return (
    <>
      {/* Navbar */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center p-4">
        <img src="/logo.PNG" alt="Logo" className="h-16" />
        <div className="flex gap-6 text-white">
          <span onClick={() => navigate('/')} className="hover:underline cursor-pointer">Filmes</span>

          <div
            className="relative"
            onMouseEnter={() => setDropdownAberto(true)}
            onMouseLeave={() => setTimeout(() => setDropdownAberto(false), 300)}
          >
            <span className="hover:underline cursor-pointer">Categorias</span>
            {dropdownAberto && (
              <ul className="absolute bg-black text-white p-2 rounded shadow top-6 z-10">
                <li className="hover:bg-gray-700 px-2 py-1 cursor-pointer">Terror</li>
                <li className="hover:bg-gray-700 px-2 py-1 cursor-pointer">Comédia</li>
                <li className="hover:bg-gray-700 px-2 py-1 cursor-pointer">Suspense</li>
                <li className="hover:bg-gray-700 px-2 py-1 cursor-pointer">Ação</li>
                <li className="hover:bg-gray-700 px-2 py-1 cursor-pointer">Romance</li>
              </ul>
            )}
          </div>

          <span className="hover:underline cursor-pointer">Favoritos</span>
          <span className="hover:underline cursor-pointer">Sobre</span>
          <span onClick={() => navigate('/cadastro')} className="hover:underline cursor-pointer">Cadastrar</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="text-white hover:underline"
        >
          Entrar
        </button>
      </div>

      {/* Lista de Filmes */}
      <div
        className="min-h-screen bg-black text-white pt-24"
        style={{
          backgroundImage: `url('/funda.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="flex justify-center items-start pt-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-6 text-yellow-500">
              Lista de Filmes Cadastrados
            </h1>

            {filmes.length === 0 ? (
              <p className="text-center text-gray-400">Nenhum filme cadastrado ainda.</p>
            ) : (
              <ul className="space-y-4">
                {filmes.map((filme: Filme, index) => (
                  <li
                    key={index}
                    className="bg-white bg-opacity-10 rounded-lg p-4 text-white shadow-md"
                  >
                    <p><strong>Nome:</strong> {filme.nome}</p>
                    <p><strong>Ano:</strong> {filme.ano}</p>
                    <p><strong>Gênero:</strong> {filme.genero}</p>
                    {filme.capa && (
                      <img
                        src={filme.capa}
                        alt={`Capa de ${filme.nome}`}
                        className="mt-2 w-40 rounded"
                      />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
