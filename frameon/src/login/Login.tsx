import constants from "os";
import React from "react";
import {useState} from "react";
import userService from "../service/userService";
import {useNavigate} from "react-router-dom";
import logo from "../assets/logo.png";
import Modal from "../assets/modal";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useForm } from 'react-hook-form';

const Login: React.FC<{}> = ({ }) => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [open, setOpen] = useState(false);
    const [modalError, setModalError] = useState('');

    const navigate = useNavigate();

    const onSubmit = (data: any) => {
      userService.login(data.email, data.senha)
        .then(result => {
          navigate('/home');
        })
        .catch(error => {
          console.error("Erro ao logar:", error);
          const message = error.response?.data?.message || 'Erro ao fazer login.';
          setModalError(message);
          setOpen(true);
        });
    };

    const onErrors = (errors: any) => {
      const firstErrorField = Object.keys(errors)[0];
      const firstErrorMessage = errors[firstErrorField]?.message || 'Erro desconhecido';
    
      setModalError(firstErrorMessage);
      setOpen(true);
    };

    return (
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-48 lg:px-8 bg-gray-950">

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

      <form
        onSubmit={handleSubmit(onSubmit, onErrors)}
        className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6"
      >
        <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-white">
              Endereço de email
            </label>
            <div className="mt-2">
              <input
                {...register('email', { required: 'O email é obrigatório.' })}
                id="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md bg-gray-900 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
                {...register('senha', { required: 'A senha é obrigatória.' })}
                id="senha"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-gray-900 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-yellow-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-yellow-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onSubmit={handleSubmit(onSubmit, onErrors)}
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
      </form>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col items-center justify-center bg-gray-900 p-6 rounded-lg w-64">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mb-2" />
          <div className="text-center">
            <h3 className="text-lg font-black text-white">Erro!</h3>
            <p className="text-sm text-white mt-2">{modalError}</p>
          </div>
        </div>
      </Modal>
      
      </div>
    );
}
export default Login;
