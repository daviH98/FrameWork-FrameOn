// src/Cadastro.jsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Filme } from "../../model/Filme.model";
import filmeService from '../../service/filmeService';
import logo from '../../assets/logo.png';
import { Controller, useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import Datepicker from 'react-tailwindcss-datepicker';
import { PhotoIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import Modal from '../../assets/modal.jsx';

const FilmeCadastro: React.FC<{}> = ({}) => {
  const { control, register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      nome: '',
      genero: '',
      ano: {
        startDate: null,
        endDate: null,
      },
      capa: '',
    }
  });

  const [nome, setNome] = useState('');
  const [ano, setAno] = useState('');
  const [genero, setGenero] = useState('');
  const[file, setFile] = useState('');
  const[open, setOpen] = useState(false);

  const[filme, setFilme] = useState<Filme>();

  const {id} = useParams();

  useEffect(() => {
    if (id) {
        filmeService.buscarPorId(id).then(filme => {
            console.log(filme)
            setNome(filme.nome);
            setAno(filme.ano);
            setGenero(filme.genero);
            setFile(filme.capa);
        });
    } else {
        console.log('id não econtrado');
    }
}, [id]);


  const salvar = (data: any) => {
    console.log('salvar');
    console.log(data);

    // Verifica se startDate é uma data e converte para string
    let startDate = data.ano?.startDate;

    // Log para verificar o valor de startDate
    console.log("startDate", startDate);

    if (startDate instanceof Date) {
      startDate = startDate.toISOString().slice(0, 10);
    }

    // Caso seja uma string, não faz nada
    console.log("startDate após conversão", startDate);

    const novoFilme: Filme = {
      id: id,
      nome: data.nome,
      ano: startDate || null,
      genero: data.genero,
      capa: data.capa || null,
    };

    setFilme(novoFilme);

    filmeService.salvarF(novoFilme)
      .then(result => {
        console.log("Salvou com sucesso!");
        console.log(result);
      })
      .catch(error => {
        console.error(error);
      });
  };

  // const editarFilme = (index: number) => {
  //   setForm({
  //     nome: filmes[index].nome,
  //     ano: filmes[index].ano?.toString() || '',
  //     genero: filmes[index].genero || '',
  //     capa: filmes[index].capa,
  //   });
  //   setEditandoIndex(index);
  // };

  // const excluirFilme = (index: number) => {
  //   const atualizados = filmes.filter((_, i) => i !== index);
  //   setFilmes(atualizados);
  //   setForm({ nome: '', ano: '', genero: '', capa: null });
  //   setEditandoIndex(null);
  // };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('capturar arquivo');
    console.log(event.target.files?.[0]);
    let file = event.target.files?.[0];
    const allowed = ["image/png", "image/jpeg", "image/jpg"];

    if (!file) {
        console.log('Por favor, selecione um arquivo');
        return;
    }

    if (file.size > 1048576 || !allowed.includes(file.type)) {
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
            <p className="text-sm text-white mt-2">
              A imagem não pode ser reconhecida.<br />
              Por favor, selecione uma imagem em PNG ou JPG de até 1mb.
            </p>
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
                    required: 'O campo precisa ser preenchido.'
                    , maxLength: { value: 60, message: 'O campo deve ser menor que 60' },
                })}
                id="nome"
                name="nome"
                value={nome}
                type="text"
                required
                className="block w-full rounded-md bg-gray-900 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
            <label className="error-message">
                <ErrorMessage errors={errors} name="nome" />
            </label>
          </div>

          <div>
            <label htmlFor="ano" className="block text-sm/6 font-medium text-white">
              Data de lançamento
            </label>
            <div>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <Datepicker
                  value={value}
                  onChange={onChange}
                  displayFormat="DD/MM/YYYY"
                  primaryColor={"yellow"}
                  useRange={false}
                  asSingle={true}
                />
              )}
              name="ano"
            />
            </div>
          </div>

          <div>
            <label htmlFor="genero" className="block text-sm/6 font-medium text-white">
              Gênero
            </label>
            <div className="mt-2">
              <input
                {...register('genero', {
                  required: 'Um gênero é necessário.',
                  })}
                id="genero"
                value={genero}
                name="genero"
                type="text"
                required
                className="block w-full rounded-md bg-gray-900 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
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
              onClick={handleSubmit(salvar)}
            >
              Registrar
            </button>
          </div>
      </div>
    </div>
  );
}

export default FilmeCadastro;
