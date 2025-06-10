// src/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const fazerLogin = () => {
    if (usuario === 'admin' && senha === '1234') {
      navigate('/');
    } else {
      setErro('Usuário ou senha incorretos.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url('/funda.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="bg-white bg-opacity-30 p-8 rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4 text-white">Login</h2>
        <input
          type="text"
          placeholder="Usuário"
          className="p-2 mb-2 rounded text-black w-full"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          className="p-2 mb-4 rounded text-black w-full"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        {erro && <p className="text-red-500 mb-2">{erro}</p>}
        <button
          onClick={fazerLogin}
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded w-full"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}

export default Login;
