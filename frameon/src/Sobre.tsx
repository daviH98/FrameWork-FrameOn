// src/Sobre.jsx
import React from "react";
import logo from "./assets/logo.png";
import { useNavigate } from 'react-router-dom';

const Sobre: React.FC<{}> = ({}) =>  {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen text-white pt-24"
      style={{
        backgroundImage: `url('/funda.png')`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="flex justify-center items-center h-full px-4 py-28">
        <div className="bg-black bg-opacity-50 p-8 rounded-lg max-w-2xl text-center space-y-3">
        <img
          alt="Your Company"
          src={logo}
          className="mx-auto h-20 w-20"
        />
          <h1 className="text-2xl font-bold text-yellow-500 mb-4 drop-shadow-lg">
            Sobre o FrameOn</h1>
          <p className="mb-4 drop-shadow-lg">
            O <strong>FrameOn</strong> é uma plataforma fictícia de filmes criada com fins educacionais
            e de prática de desenvolvimento front-end com React. Aqui, você pode
            explorar filmes por categorias, cadastrar novos títulos, favoritar seus
            favoritos e interagir com uma interface inspirada em serviços reais de
            streaming.
          </p>
          <p className="text-sm drop-shadow-lg">
            Projeto criado para fins de aprendizagem com ReactJS, TailwindCSS e React Router DOM.
          </p>
          <button
              type="submit"
              className="justify-center rounded-md bg-yellow-700 px-3 py-1 text-sm/6 font-semibold text-white shadow-xs hover:bg-yellow-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => navigate('/')}
            >
              Voltar
            </button>
        </div>
      </div>
    </div>
  );
}

export default Sobre;
