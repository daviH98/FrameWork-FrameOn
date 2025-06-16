// src/Cadastro.jsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Filme } from "../../model/Filme.model";
import filmeService from '../../service/filmeService';
import logo from '../../assets/logo.png';
import { Controller, useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import Datepicker from 'react-tailwindcss-datepicker';
import { PhotoIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import Modal from '../../assets/modal.jsx';
import { IMaskInput } from 'react-imask';

const FilmeCadastro: React.FC<{}> = ({}) => {
  const { control, register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      nome: '',
      categoria_id: '',
      ano: '',
      capa: '',
    }
  });

  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setSuccess] = useState<string | null>(null);
  const[open, setOpen] = useState(false);
  const[openOnSuccess, setOpenOnSuccess] = useState(false);
  const[filme, setFilme] = useState<Filme>();
  const[file, setFile] = useState('');
  const [categorias, setCategorias] = useState<{ id: number, nome: string }[]>([]);
  const [novaCategoria, setNovaCategoria] = useState('');
  const navigate = useNavigate();

  const {id} = useParams();

  useEffect(() => {        
    filmeService.listarCategorias()
      .then(categorias => setCategorias(categorias))
      .catch(err => console.error("Erro ao carregar categorias", err));
    if (id) {
        filmeService.buscarPorId(id).then(filme => {
            console.log(filme);
            setFilme(filme);
            setValue("nome", filme.nome);
            setValue("ano", filme.ano || '');
            setValue("categoria_id", filme.categoria_id);
            setValue("capa", filme.capa);
        });

    } else {
        console.log('id não econtrado');
    }
}, [id, setValue]);

  function isValidDate(dateString: string) {
    const [day, month, year] = dateString.split('/').map(Number);
    if (!day || !month || !year) return false;

    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }

  const onErrors = (errors: any) => {
    const firstErrorField = Object.keys(errors)[0];
    const firstErrorMessage = errors[firstErrorField]?.message || 'Erro desconhecido';
  
    setModalError(firstErrorMessage);
    setOpen(true);
  };

  const adicionarCategoria = () => {
    if (!novaCategoria) return;
    fetch('/api/categorias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: novaCategoria }),
    })
      .then(res => res.json())
      .then(cat => {
        setCategorias(prev => [...prev, cat]);
        setNovaCategoria('');
      })
      .catch(err => console.error(err));
  };


  const salvar = (data: any) => {
    console.log('salvar');
    console.log(data);

    const novoFilme: Filme = {
      id: id,
      nome: data.nome,
      ano: data.ano || null,
      capa: data.capa || null,
      categoria_id: data.categoria_id,
    };

    setFilme(novoFilme);

    filmeService.salvarF(novoFilme)
      .then(result => {
        console.log("Salvou com sucesso!");
        console.log(result);
        setSuccess('O filme foi cadastrado com sucesso.');
        setOpenOnSuccess(true);
      })
      .catch(error => {
        console.error(error);
        setModalError('Erro ao salvar o filme.');
        setOpen(true);
      });
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('capturar arquivo');
    console.log(event.target.files?.[0]);
    let file = event.target.files?.[0];
    const allowed = ["image/png", "image/jpeg", "image/jpg"];

    if (!file) {
        setModalError('Por favor, selecione um arquivo.');
        return;
    }

    if (file.size > 1048576 || !allowed.includes(file.type)) {
      setModalError('Por favor, selecione uma imagem PNG ou JPG de até 1MB.');
      setOpen(true);
      return;
    }

    const imagePreviewUrl = URL.createObjectURL(file);
    setFile(imagePreviewUrl);

    const formData = new FormData();
    formData.append('file', file);

    console.log('enviando o arquivo para o be');
    filmeService.uploadArquivo(formData).then(result => {
      const fileName = result.filename;
      setValue('capa', fileName);
    }).catch(err => {
      console.error("Erro ao carregar a imagem:", err);
    });
}

useEffect(() => { console.log(filme) },[filme]);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-10 lg:px-8 bg-gray-950">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col items-center justify-center bg-gray-900 p-6 rounded-lg w-64">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mb-2" />
          <div className="text-center">
            <h3 className="text-lg font-black text-white">Erro!</h3>
            <p className="text-sm text-white mt-2">{modalError}</p>
          </div>
        </div>
      </Modal>

      <Modal open={openOnSuccess} onClose={() => {setOpenOnSuccess(false); navigate('/');}}>
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
          Registrar filmes
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
        <div>
            <label htmlFor="nome" className="block text-sm/6 font-medium text-white">
              Nome do filme
            </label>
            <div className="mt-2">
              <input
                {...register("nome", {
                    required: `O campo 'Nome' precisa ser preenchido.`
                    , maxLength: { value: 60, message: 'O campo deve ser menor que 60' },
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
            <label htmlFor="ano" className="block text-sm/6 font-medium text-white">
              Data de lançamento
            </label>
            <div>
            <Controller
              name="ano"
              control={control}
              rules={{
                required: `O campo 'Data de lançamento' precisa ser preenchido.`,
                validate: (value) =>
                  isValidDate(value) || 'Data inválida, use o formato DD/MM/AAAA',
              }}
              render={({ field }) => (
                <IMaskInput
                  {...field}
                  mask="00/00/0000"
                  placeholder="DD/MM/AAAA"
                  className="block w-full rounded-md bg-gray-900 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onAccept={(value: string) => field.onChange(value)}
                />
              )}
            />
            </div>
          </div>

          <div>
            <label htmlFor="categoria" className="block text-sm/6 font-medium text-white">
              Gênero
            </label>
            <div className="mt-2">
              <select
                {...register("categoria_id", { required: "Um gênero é obrigatório." })}
                id="categoria_id"
                name="categoria_id"
                className="block w-full rounded-md bg-gray-900 px-3 py-1.5 text-white sm:text-sm/6"
              >
                <option value="">Selecione um gênero</option>

                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-span-full space-y-2">
              <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-white">
                Capa do filme
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
                <div className="text-center">
                  <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
                  <div className="mt-4 flex text-sm/6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer font-semibold text-yellow-400 hover:text-indigo-300"
                    >
                      <span>Escolha um arquivo</span>
                      <input id="file-upload" name="file-upload" type="file" accept="image/png, image/jpeg" className="sr-only" onChange={handleUpload} />
                    </label>
                    <p className="pl-1 text-gray-200">ou arraste aqui</p>
                  </div>
                  <p className="text-xs/5 text-gray-200">PNG ou JPG até 1MB</p>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-white">
                Prévia:
              </label>
              {file && (
                <img
                  src={file.startsWith('blob:') ? file : `http://localhost:8080/imagens/${file}`}
                  alt="Capa do Filme"
                  className="h-48"
                />
              )}
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
      </div>
    </div>
  );
}

export default FilmeCadastro;
