// src/Sobre.jsx
import React from "react";

function Sobre() {
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
      <div className="flex justify-center items-center h-full px-4">
        <div className="bg-black bg-opacity-50 p-8 rounded-lg max-w-2xl text-center">
          <h1 className="text-2xl font-bold text-yellow-500 mb-4">Sobre o FrameOn</h1>
          <p className="mb-4">
            O <strong>FrameOn</strong> é uma plataforma fictícia de filmes criada com fins educacionais
            e de prática de desenvolvimento front-end com React. Aqui, você pode
            explorar filmes por categorias, cadastrar novos títulos, favoritar seus
            favoritos e interagir com uma interface inspirada em serviços reais de
            streaming.
          </p>
          <p className="text-sm">
            Projeto criado para fins de aprendizagem com ReactJS, TailwindCSS e React Router DOM.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Sobre;
