// src/Cadastro.jsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filme } from "./model/Filme.model";
import { Formulario } from "./model/Formulario.model";

function Cadastro() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [form, setForm] = useState<Formulario>({ nome: '', ano: '', genero: '', capa: null });
  const [erro, setErro] = useState<string>('');
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [dropdownAberto, setDropdownAberto] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const armazenados = JSON.parse(localStorage.getItem('filmes') || '{}');
    setFilmes(armazenados);
  }, []);

  useEffect(() => {
    localStorage.setItem('filmes', JSON.stringify(filmes));
  }, [filmes]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === 'capa'  && files && files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setForm({ ...form, capa: url });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validar = () => {
    if (!form.nome.trim() || !form.ano || !form.genero || !form.capa) {
      setErro('Preencha todos os campos.');
      return false;
    }
    setErro('');
    return true;
  };

  const salvarFilme = () => {
    if (!validar()) return;

    const novoFilme = {
      nome: form.nome.trim(),
      ano: new Date(form.ano).getFullYear(),
      genero: form.genero,
      capa: form.capa,
    };

    if (editandoIndex !== null) {
      const atualizados = [...filmes];
      atualizados[editandoIndex] = novoFilme;
      setFilmes(atualizados);
      setEditandoIndex(null);
    } else {
      setFilmes([...filmes, novoFilme]);
    }

    setForm({ nome: '', ano: '', genero: '', capa: null });
  };

  const editarFilme = (index: number) => {
    setForm({
      nome: filmes[index].nome,
      ano: filmes[index].ano?.toString() || '',
      genero: filmes[index].genero || '',
      capa: filmes[index].capa,
    });
    setEditandoIndex(index);
  };

  const excluirFilme = (index: number) => {
    const atualizados = filmes.filter((_, i) => i !== index);
    setFilmes(atualizados);
    setForm({ nome: '', ano: '', genero: '', capa: null });
    setEditandoIndex(null);
  };

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

      {/* Formulário */}
      <div
        className="min-h-screen bg-black text-white pt-24"
        style={{
          backgroundImage: `url('/funda.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4" style={{ color: '#B8860B' }}>Cadastro de Filmes:</h1>

            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <input type="text" name="nome" value={form.nome} onChange={handleChange} placeholder="Nome do filme" className="p-2 rounded text-black bg-yellow-800 placeholder-white" />
              <input type="date" name="ano" value={form.ano} onChange={handleChange} max={new Date().toISOString().split('T')[0]} className="p-2 rounded text-black bg-yellow-800 placeholder-white" />
              <select name="genero" value={form.genero} onChange={handleChange} className="p-2 rounded text-black bg-yellow-800">
                <option value="">Selecione o gênero</option>
                <option>Terror</option>
                <option>Comédia</option>
                <option>Suspense</option>
                <option>Ação</option>
                <option>Romance</option>
              </select>
              <input type="file" accept="image/*" name="capa" onChange={handleChange} className="p-2 rounded text-white bg-yellow-800" />
            </div>

            {erro && <p className="text-red-500 mb-2">{erro}</p>}

            <button onClick={salvarFilme} className="bg-yellow-800 hover:bg-yellow-700 text-white py-2 px-4 rounded">
              {editandoIndex !== null ? 'Atualizar' : 'Adicionar'}
            </button>

            <div className="mt-6 text-left text-white">
              <h2 className="font-bold">Filmes cadastrados:</h2>
              <ul className="mt-2">
                {filmes.map((filme, index) => (
                  <div key={index} className="mb-4 flex items-center gap-4">
                    <img src={filme.capa || ''} alt="Capa" className="w-20 h-28 object-cover rounded" />
                    <div>
                      {filme.nome} - {filme.ano} - {filme.genero}
                      <div>
                        <button onClick={() => editarFilme(index)} className="ml-2 px-2 py-1 bg-yellow-500 rounded hover:bg-yellow-600">Editar</button>
                        <button onClick={() => excluirFilme(index)} className="ml-2 px-2 py-1 bg-red-500 rounded hover:bg-red-600">Excluir</button>
                      </div>
                    </div>
                  </div>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cadastro;
