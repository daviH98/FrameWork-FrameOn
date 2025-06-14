// src/FilmesPage.jsx
import React, { useState } from "react";
import { FaPlay, FaRegStar, FaStar } from "react-icons/fa";
import { Filme } from "../../model/Filme.model";
import filmeService from "../../service/filmeService";
import { useNavigate } from "react-router-dom";

const FilmesPage: React.FC<{}> = ({}) => {

  const[filmes, setFilme] = useState<Filme[]>([]);
  const navigate = useNavigate();

  const buscarFilmes = () => {
    filmeService.listar().then((filmes: Filme[]) => {
      const filmesConvertidos = filmes.map((filme) => {
        let capaUrl: string | null = null;
  
        if (filme.capa && typeof filme.capa === 'string') {
          capaUrl = `http://localhost:8080/imagens/${filme.capa}`;
          console.log(capaUrl);
        }
        return { ...filme, capa: capaUrl };
      });
  
      setFilme(filmesConvertidos);
    });
  };

  const carregar = (id: number) => {
      navigate(`/filme/${id}`); 
  }

  // const alternarFavorito = (filme: Filme) => {
  //   const estaFavoritado = favoritos.includes(filme.nome);
  //   if (estaFavoritado) {
  //     setFavoritos(favoritos.filter((nome) => nome !== filme.nome));
  //     setMensagem("Removido dos favoritos");
  //   } else {
  //     setFavoritos([...favoritos, filme.nome]);
  //     setMensagem("Adicionado aos favoritos");
  //   }
  //   setTimeout(() => setMensagem(""), 2000);
  // };

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
          <button className="text-white" onClick={buscarFilmes} type="button">Pesquisar</button>
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b font-medium dark:border-neutral-500 text-white">
                <tr>
                  <th scope="col" className="px-6 py-4">#</th>
                  <th scope="col" className="px-6 py-4">Nome</th>
                  <th scope="col" className="px-6 py-4">Ano</th>
                  <th scope="col" className="px-6 py-4">Gênero</th>
                  <th scope="col" className="px-6 py-4">Imagem</th>
                  <th scope="col" className="px-6 py-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {
                  filmes?.map((filme: Filme) =>  {
                    {console.log(filme.ano)}
                    return (
                        <tr key={filme.id} className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
                            <th className="-nowrap px-6 py-4 font-medium text-white">{filme.id}</th>
                            <td className="-nowrap px-6 py-4 text-white">{filme.nome}</td>
                            <td className="-nowrap px-6 py-4 text-white">{filme.ano.toString()}</td>
                            <td className="-nowrap px-6 py-4 text-white">{filme.genero}</td>
                            <td className="-nowrap px-6 py-4 text-white">
                            {filme.capa ? (
                              // Se a capa for uma string (URL ou base64), basta usá-la diretamente
                              <img src={filme.capa} alt="Capa do Filme" className="h-16"   />
                            ) : (
                              "Sem imagem"
                            )}
                              </td>
                            <td><button type="button" className="justify-center rounded-md bg-cyan-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-cyan-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={() => { carregar(filme.id)}}>Carregar</button></td>
                            <td><button type="button" className="justify-center rounded-md bg-red-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={() => { carregar(filme.id)}}>Apagar</button></td>
                        </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


export default FilmesPage;
