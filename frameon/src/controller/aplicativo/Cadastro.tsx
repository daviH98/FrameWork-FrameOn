import React, { useState, useEffect } from "react";
import { UsuarioModel } from "../../model/Usuario.model";
import usuarioService from "../../service/userService";
import { data, useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import Datepicker from "react-tailwindcss-datepicker";
import type { DateValueType } from "react-tailwindcss-datepicker";
import { EyeIcon, EyeSlashIcon, ExclamationTriangleIcon, CheckCircleIcon,  } from '@heroicons/react/24/solid';
import logo from "../../assets/logo.png";
import Modal from "../../assets/modal";
import { IMaskInput } from "react-imask";

const Usuario: React.FC<{}> = ({}) => {

    const { control, register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
      defaultValues: {
        nome: '',
        email: '',
        password: '',
        passwordConfirm: '',
        dOB: '',
      }
    });

    const [modalError, setModalError] = useState<string | null>(null);
    const [modalSuccess, setSuccess] = useState<string | null>(null);
    const[open, setOpen] = useState(false);
    const[openOnSuccess, setOpenOnSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const[usuario, setUsuario] = useState<UsuarioModel>();
    const navigate = useNavigate();

    const {id} = useParams();

    useEffect(() => {
      if (id) {
          usuarioService.buscarPorId(id).then(usuario => {
              console.log(usuario)
              setValue("nome", usuario.nome);
              setValue("dOB", usuario.dOB || '');
              setValue("email", usuario.email);
          });
      } else {
          console.log('id não econtrado');
      }
  }, [id, setValue]);

  useEffect(() => {
    if (errors.passwordConfirm?.message === 'As senhas não condizem.') {
      setModalError('As senhas não condizem.');
      setOpen(true);
    }
    if (errors.password?.message === 'A senha precisa ter pelo menos 6 caracteres.') {
      setModalError(errors.password.message);
      setOpen(true);
    }
  }, [errors.passwordConfirm, errors.password]);

  const onErrors = (errors: any) => {
    const firstErrorField = Object.keys(errors)[0];
    const firstErrorMessage = errors[firstErrorField]?.message || 'Erro desconhecido';
  
    setModalError(firstErrorMessage);
    setOpen(true);
  };

  const salvar = (data: any) => {
    console.log('salvar');
    console.log(data);

    const novoUsuario: UsuarioModel = {
      id: id,
      nome: data.nome,
      email: data.email,
      senha: data.password,
      dOB: data.dOB || null,
      role: 'user'
    };

    setUsuario(novoUsuario);

    usuarioService.salvar(novoUsuario)
      .then(result => {
        console.log("Salvou com sucesso!");
        console.log(result);
        setSuccess('Você foi cadastrado(a) com sucesso.');
        setOpenOnSuccess(true);
      })
      .catch(error => {
        console.error(error);
        setModalError('Erro ao salvar o usuário.');
        setOpen(true);
      });
  };

    useEffect(() => { console.log(usuario) },[usuario]);

    return (
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-40 lg:px-8 bg-gray-950">
        <Modal open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col items-center justify-center bg-gray-900 p-6 rounded-lg w-64">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mb-2" />
          <div className="text-center">
            <h3 className="text-lg font-black text-white">Erro!</h3>
            <p className="text-sm text-white mt-2">{modalError}</p>
          </div>
        </div>
      </Modal>

      <Modal open={openOnSuccess} onClose={() => {setOpenOnSuccess(false); navigate('/login');}}>
        <div className="flex flex-col items-center justify-center bg-gray-900 p-6 rounded-lg w-64">
          <CheckCircleIcon className="h-8 w-8 text-green-600 mb-2" />
          <div className="text-center">
            <h3 className="text-lg font-black text-white">Sucesso!</h3>
            <p className="text-sm text-white mt-2">{modalSuccess}</p>
          </div>
        </div>
      </Modal>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
          alt="Your Company"
          src={logo}
          className="mx-auto h-10 w-10"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Registre-se
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
        <div>
            <label htmlFor="nome" className="block text-sm/6 font-medium text-white">
              Seu nome
            </label>
            <div className="mt-2">
              <input
                {...register("nome", {
                    required: `O campo 'Nome' precisa ser preenchido.`
                    , maxLength: { value: 10, message: 'O campo deve ser menor que 10' },
                })}
                id="nome"
                name="nome"
                type="text"
                required
                className="block w-full rounded-md bg-gray-900 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm/6 font-medium text-white">
              Data de nascimento
            </label>
            <div>
            <Controller
              name="dOB"
              control={control}
              rules={{
                required: `O campo 'Data de nascimento' precisa ser preenchido.`,
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="date"
                  className="block w-full rounded-md bg-gray-900 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              )}
            />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-white">
              Endereço de email
            </label>
            <div className="mt-2">
              <input
                {...register('email', {
                  required: 'Um endereço de email é necessário.',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido.',
                }})}
                id="email"
                name="email"
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
            </div>
            <div className="mt-2 relative">
              <input
                {...register('password', {
                  required: 'Uma senha é necessária.',
                  minLength: {
                    value: 6,
                    message: 'A senha precisa ter pelo menos 6 caracteres.',
                  }
                })}
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-gray-900 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-5 right-2 flex items-center text-sm text-gray-400 hover:text-white focus:outline-none"
              >
                {showPassword ? <EyeIcon className="h-7 w-7 text-white mb-2"/>: <EyeSlashIcon className="h-7 w-7 text-white mb-2"/>}
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-white">
                Confirmar senha
              </label>
            </div>
            <div className="mt-2">
              <input
                {...register('passwordConfirm', {
                  required: 'Confirme a sua senha.',
                  validate: (value) => {
                    return value === watch('password') || 'As senhas não condizem.'
                  }
                })}
                id="passwordConfirm"
                name="passwordConfirm"
                type={showPassword ? 'text' : 'password'}
                required
                className="block w-full rounded-md bg-gray-900 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-yellow-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-yellow-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleSubmit(salvar, onErrors)}
            >
              Registrar
            </button>
          </div>

        <p className="mt-10 text-center text-sm/6 text-white">
          Já tem uma conta?{' '}
          <a href="/login" className="font-semibold text-yellow-700 hover:text-yellow-500">
            Entre aqui
          </a>
        </p>
      </div>
    </div>
    );
}
export default Usuario;
