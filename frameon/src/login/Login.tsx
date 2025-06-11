import constants from "os";
import React from "react";
import {useState} from "react";
import userService from "../service/userService";
import {useNavigate} from "react-router-dom";
import logo from "../assets/logo.png";

const Login: React.FC<{}> = ({ }) => {

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const navigate = useNavigate();

    const login = () => {
        console.log("login do sistema");

        userService.login(email,senha).then(result => {
            console.log(result);

            if (result.token) {
                localStorage.setItem('token', result.token);
                navigate('/');}
        });
    }

    return (
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-40 lg:px-8 bg-gray-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src={logo}
          className="mx-auto h-10 w-10"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Fazer login
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-white">
              Endereço de email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md bg-gray-900 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-white">
                Senha
              </label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-yellow-700 hover:text-yellow-500">
                  Esqueceu a senha?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-gray-900 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-yellow-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-yellow-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={login}
            >
              Entrar
            </button>
          </div>

        <p className="mt-10 text-center text-sm/6 text-white">
          Não tem uma conta?{' '}
          <a href="/usuario" className="font-semibold text-yellow-700 hover:text-yellow-500">
            Registre-se aqui
          </a>
        </p>
      </div>
    </div>
    );
}
export default Login;
