import React, { useState, useEffect } from "react";
import { UsuarioModel } from "../../model/Usuario.model";
import usuarioService from "../../service/userService";
import { useParams } from "react-router-dom";
import Datepicker from "react-tailwindcss-datepicker";
import type { DateValueType } from "react-tailwindcss-datepicker";
import { PhotoIcon } from '@heroicons/react/24/solid';

const Usuario: React.FC<{}> = ({}) => {

    const[nome, setNome] = useState('');
    const[email, setEmail] = useState('');
    const[senha, setSenha] = useState('');
    const[dataNasc, setDtNasc] = useState<DateValueType>({ 
      startDate: null, 
      endDate: null
  });
    const[file, setFile] = useState();

    const[usuario, setUsuario] = useState<UsuarioModel>();

    const {id} = useParams();

    useEffect(() => {
      if (id) {
        usuarioService.buscarPorId(id).then(usuario => {
            console.log(usuario.id);
            setNome(usuario.nome);
            setEmail(usuario.email);
            setSenha(usuario.senha);
            setDtNasc(usuario.dataNasc);
        });
        } else {
          console.log('id não encontrado');
        }
    },[id]);

    const salvar = () => {
        console.log('salvar');
        console.log(nome);
        console.log(email);
        console.log(dataNasc);
        setUsuario({
          id: id,
          nome: nome,
          email: email,
          senha: senha,
          dataNascimento: dataNasc?.startDate
        });

        usuarioService.salvar({
          id: id,
          nome: nome,
          email: email,
          senha: senha,
          dataNascimento: dataNasc
      }).then(result => {
          console.log("Salvou com sucesso!");
          console.log(result);
      }, error => {
          console.log(error);           
      });
    }

    const handleUpload = (event: any) => {
      console.log(event.target.files[0])
      let file = event.target.files[0];

      if(!file) {
        console.log('Por favor, selecione um arquivo');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      console.log('arquivo enviado')
      usuarioService.uploadArquivo(file).then(result => {

      });
    }

    useEffect(() => { console.log(usuario) },[usuario]);

    return (
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-10 lg:px-8 bg-gray-800">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Registre-se
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form action="#" method="POST" className="space-y-6">
        <div>
            <label htmlFor="nome" className="block text-sm/6 font-medium text-white">
              Seu nome
            </label>
            <div className="mt-2">
              <input
                id="nome"
                name="nome"
                type="text"
                required
                className="block w-full rounded-md bg-gray-700 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm/6 font-medium text-white">
              Data de nascimento
            </label>
            <div>
            <Datepicker
              primaryColor={"indigo"}
              useRange={false}
              asSingle={true} 
              value={dataNasc} 
              onChange={date => date && setDtNasc(date)}
            /> 
            </div>
          </div>

          <div className="col-span-full">
              <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-white">
                Foto de perfil
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
                <div className="text-center">
                  <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
                  <div className="mt-4 flex text-sm/6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                      <span>Escolha um arquivo</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1 text-gray-200">ou arraste aqui</p>
                  </div>
                  <p className="text-xs/5 text-gray-200">PNG ou JPG até 1MB</p>
                </div>
              </div>
            </div>

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
                className="block w-full rounded-md bg-gray-700 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-white">
                Senha
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-gray-700 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onChange={salvar}
            >
              Registrar
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-white">
          Já tem uma conta?{' '}
          <a href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Entre aqui
          </a>
        </p>
      </div>
    </div>
    );
}
export default Usuario;
