// src/Home.jsx
import { useEffect, useState } from 'react';

function Home() {
  const [filmes, setFilmes] = useState([]);

  useEffect(() => {
    const armazenados = JSON.parse(localStorage.getItem('filmes')) || [];
    setFilmes(armazenados);
  }, []);

  return (
    <>
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
                {filmes.map((filme, index) => (
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
