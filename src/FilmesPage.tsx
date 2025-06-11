// src/FilmesPage.jsx
import React, { useState } from "react";
import { FaPlay, FaRegStar, FaStar } from "react-icons/fa";

function FilmesPage() {
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [favoritos, setFavoritos] = useState([]);
  const [mensagem, setMensagem] = useState("");

  const filmesPorCategoria = {
    Terror: [
      { nome: "Invocação do Mal", capa: "/invocacao-do-mal.png" },
      { nome: "Hereditário", capa: "/hereditario.png" }
    ],
    Comédia: [
      { nome: "Gente Grande", capa: "/gente-grande.jpg" },
      { nome: "Norbit", capa: "/norbit.jpg" }
    ],
    Suspense: [
      { nome: "Parasita", capa: "/parasita.jpg" },
      { nome: "Corra", capa: "/corra.jpg" }
    ],
    Ação: [
      { nome: "Missão Impossível", capa: "/missao-impossivel.jpg" },
      { nome: "Velozes e Furiosos", capa: "/velozes-e-furiosos.jpg" }
    ],
    Romance: [
      { nome: "Crepúsculo", capa: "/crepusculo.jpg" },
      { nome: "Titanic", capa: "/titanic.jpg" }
    ]
  };

  const todosFilmes = Object.values(filmesPorCategoria).flat();

  const alternarFavorito = (filme) => {
    const estaFavoritado = favoritos.includes(filme.nome);
    if (estaFavoritado) {
      setFavoritos(favoritos.filter((nome) => nome !== filme.nome));
      setMensagem("Removido dos favoritos");
    } else {
      setFavoritos([...favoritos, filme.nome]);
      setMensagem("Adicionado aos favoritos");
    }
    setTimeout(() => setMensagem(""), 2000);
  };

  return (
    <div
      className="min-h-screen text-white pt-24"
      style={{
        backgroundImage: `url('/funda.png')`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Navbar */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center p-4 z-10">
        <img src="/logo.PNG" alt="Logo" className="h-24" />
        <div className="flex gap-6 text-white items-center">
          <a href="/" className="hover:underline cursor-pointer">Filmes</a>
          <a href="/cadastro" className="hover:underline cursor-pointer">Cadastrar</a>
          <div
            className="relative"
            onMouseEnter={() => setDropdownAberto(true)}
            onMouseLeave={() => setTimeout(() => setDropdownAberto(false), 300)}
          >
            <span className="hover:underline cursor-pointer">Categorias</span>
            {dropdownAberto && (
              <ul className="absolute bg-black text-white p-2 rounded shadow top-6 left-0">
                {Object.keys(filmesPorCategoria).map((categoria, i) => (
                  <li key={i} className="hover:bg-gray-700 px-2 py-1 cursor-pointer">{categoria}</li>
                ))}
              </ul>
            )}
          </div>
          <span className="hover:underline cursor-pointer">Favoritos</span>
          <span className="hover:underline cursor-pointer">Sobre</span>
        </div>
        <button
          onClick={() => window.location.href = '/login'}
          className="text-white hover:underline"
        >
          Entrar
        </button>
      </div>

      {/* Lista de Filmes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4 pt-12">
        {todosFilmes.map((filme, index) => (
          <div key={index} className="text-center relative group">
            <img
              src={filme.capa}
              alt={`Capa de ${filme.nome}`}
              className="w-full h-60 object-cover rounded shadow-md"
            />
            <FaPlay className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-white text-xl" />
            <button
              className="absolute bottom-2 right-2 text-white text-lg hover:scale-110 transition"
              onClick={() => alternarFavorito(filme)}
            >
              {favoritos.includes(filme.nome) ? <FaStar className="text-yellow-400" /> : <FaRegStar />}
            </button>
            <p className="mt-1 text-sm">{filme.nome}</p>
          </div>
        ))}
      </div>

      {/* Mensagem Temporária */}
      {mensagem && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow-md z-50">
          {mensagem}
        </div>
      )}
    </div>
  );
}

export default FilmesPage;
