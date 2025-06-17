import React, { useEffect, useState } from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon, UserCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Modal from '../assets/modal';
import filmeService from '../service/filmeService';
import { useNavigate } from 'react-router-dom';
import { Filme } from '../model/Filme.model';
import { Categoria } from "../model/categoria.model";
import logo from "../assets/logo.png";
import ExclamationTriangleIcon from '@heroicons/react/24/solid/ExclamationTriangleIcon';

const AdminDashboard: React.FC<{}> = ({}) =>  {
    const[filmes, setFilme] = useState<Filme[]>([]);
    const navigate = useNavigate();

    const buscarFilmes = () => {
        filmeService.listar().then((filmes: Filme[]) => {
        const filmesConvertidos = filmes.map((filme) => {
            let capaUrl: string | null = null;
    
            if (filme.capa && typeof filme.capa === 'string') {
            capaUrl = `http://localhost:8080/imagens/${filme.capa}`;
            console.log(capaUrl);
            }
            return { ...filme, capa: capaUrl };
        });
    
        setFilme(filmesConvertidos);
        });
    };

    const carregarCategorias = async () => {
        try {
          const resultado = await filmeService.listarCategorias(); // função do filmeService
          setCategorias(resultado);
        } catch (erro) {
          console.error("Erro ao carregar categorias:", erro);
        }
      };

    useEffect(() => {
        buscarFilmes();
        carregarCategorias();
    }, []);

    const deleteUser = async (id: any) => {
        if (!window.confirm("Deseja excluir?")) {
          return;
        }
      
        try {
          console.log("chamou o excluir", id);
          const result = await filmeService.apagar(id);
      
          if (result) {
            alert("Filme deletado com sucesso!");
            window.location.reload();
          } else {
            alert("Erro ao excluir o filme.");
          }
        } catch (error) {
          console.error(error);
          alert("Erro ao excluir o filme.");
        }
      };

      const salvarCategoria = async (id: number) => {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/api/categoria/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nome: novoNome }),
        });
      
        if (response.ok) {
          setEditandoId(null);
          carregarCategorias();
        }
      };
      
      const adicionarCategoria = async () => {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/api/categoria`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nome: novoNome }),
        });
      
        if (response.ok) {
          setNovoNome("");
          carregarCategorias();
        }
      };

      const deletarCategoria = async (id: number) => {
        if (!window.confirm("Tem certeza que deseja excluir essa categoria?")) return;
        const token = localStorage.getItem("token");
      
        try {
           const response = await fetch(`http://localhost:8080/api/categoria/${id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ nome: novoNome }),
           });

           if (response.ok) {
            carregarCategorias();
          } else {
            const data = await response.json();
            if (response.status === 409) {
                setModalError(data.message);
                setOpen(true);
            } else {
                setModalError('Erro ao deletar categoria');
                setOpen(true);
            }
            return;
          }
        } catch (erro) {
          console.error("Erro ao excluir categoria:", erro);
        }
      };

    const carregar = (id: number) => {
        navigate(`/filme/${id}`); 
    }
    
    const navigation = [
        { name: 'Catálogo', href: '/home', current: false },
        { name: 'Sobre', href: '/sobre', current: false },
        { name: 'Favoritos', href: '/alugados', current: false },
        { name: 'Admin', href: '/admin', current: true },
    ]
    
    function classNames(...classes: any[]) {
        return classes.filter(Boolean).join(' ')
    }

    const [modalError, setModalError] = useState<string | null>(null);
    const [modalSuccess, setSuccess] = useState<string | null>(null);
    const[open, setOpen] = useState(false);
    const[openOnSuccess, setOpenOnSuccess] = useState(false);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [novoNome, setNovoNome] = useState("");
    
    const signOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        localStorage.removeItem('token');
        setSuccess('Você saiu da sua conta.');
        setOpenOnSuccess(true);
    };

    const onErrors = (errors: any) => {
        const firstErrorField = Object.keys(errors)[0];
        const firstErrorMessage = errors[firstErrorField]?.message || 'Erro desconhecido';
      
        setModalError(firstErrorMessage);
        setOpen(true);
      };
  
    return (
        <div
        className="min-h-screen"
        style={{
          backgroundColor: `rgb(3 7 18)`,
        }}
    >
    <Modal open={openOnSuccess} onClose={() => {setOpenOnSuccess(false); navigate('/login');}}>
        <div className="flex flex-col items-center justify-center bg-gray-900 p-6 rounded-lg w-64">
          <CheckCircleIcon className="h-8 w-8 text-green-600 mb-2" />
          <div className="text-center">
            <h3 className="text-lg font-black text-white">Sucesso!</h3>
            <p className="text-sm text-white mt-2">{modalSuccess}</p>
          </div>
        </div>
      </Modal>

    <Modal open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col items-center justify-center bg-gray-900 p-6 rounded-lg w-64">
        <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mb-2" />
        <div className="text-center">
            <h3 className="text-lg font-black text-white">Erro!</h3>
            <p className="text-sm text-white mt-2">{modalError}</p>
        </div>
        </div>
    </Modal>

      {/* Navbar */}
      <Disclosure as="nav" className="bg-black">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-center">
            <div className="flex shrink-0 items-center">
              <img
                alt="Your Company"
                src={logo}
                className="mx-auto h-10 w-10"
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current ? 'bg-white text-black' : 'text-gray-300 hover:bg-white hover:text-black',
                      'rounded-md px-3 py-2 text-sm font-medium',
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <UserCircleIcon
                    className="text-white size-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-black py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  <a
                    href="/usuario"
                    className="block px-4 py-2 text-sm text-white hover:bg-white hover:text-black data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Seu perfil
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href='#'
                    onClick={signOut}
                    className="block px-4 py-2 text-sm text-white hover:bg-white hover:text-black data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Sair
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium',
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>

      <div className="text-white p-4 flex flex-col items-center space-y-4">
        <h1 className="text-2xl font-bold mb-6">Área do Administrador</h1>
        <div className="flex justify-center w-full">
        <div className="bg-gray-900 rounded-lg drop-shadow-lg p-6 w-full max-w-4xl">
            <div className="max-h-[400px] overflow-y-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Lista de filmes</h1>
            <table className="w-full text-left text-sm font-light">
            <thead className="border-b font-medium text-white">
                <tr>
                <th scope="col" className="px-6 py-4">#</th>
                <th scope="col" className="px-6 py-4">Nome</th>
                <th scope="col" className="px-6 py-4">Ano</th>
                <th scope="col" className="px-6 py-4">Gênero</th>
                <th scope="col" className="px-6 py-4">Imagem</th>
                <th scope="col" className="px-6 py-4">Ações</th>
                </tr>
            </thead>
            <tbody>
                {filmes?.map((filme: Filme) => (
                <tr
                    key={filme.id}
                    className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                >
                    <th className="whitespace-nowrap px-6 py-4 font-medium text-white">{filme.id}</th>
                    <td className="whitespace-nowrap px-6 py-4 text-white">{filme.nome}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-white">{filme.ano}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-white">{filme.categoria}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-white">
                    {filme.capa ? (
                        <img src={filme.capa} alt="Capa do Filme" className="h-16" />
                    ) : (
                        "Sem imagem"
                    )}
                    </td>
                    <td className="flex gap-2 px-6 py-4">
                    <button
                        type="button"
                        className="rounded-md bg-cyan-700 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-cyan-500"
                        onClick={() => carregar(filme.id)}
                    >
                        Carregar
                    </button>
                    <button
                        type="button"
                        className="rounded-md bg-red-700 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-red-500"
                        onClick={() => deleteUser(filme.id)}
                    >
                        Apagar
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
            </div>
            <div className="mt-6 flex justify-center">
            <button
            onClick={() => navigate('/filme')}
            className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-2 rounded-md shadow"
            >
            + Adicionar Novo Filme
            </button>
        </div>
        </div>
        </div>
        <div className="flex justify-center w-full">
        <div className="bg-gray-900 rounded-lg drop-shadow-lg p-6 w-full max-w-4xl">
            <div className="max-h-[400px] overflow-y-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Gêneros</h1>
            <table className="w-full text-left text-sm font-light">
            <thead className="border-b font-medium text-white">
                <tr>
                <th scope="col" className="px-6 py-4">#</th>
                <th scope="col" className="px-6 py-4"></th>
                </tr>
            </thead>
            <tbody>
                {categorias.map((categoria) => (
                    <tr key={categoria.id} className="border-b dark:border-neutral-500 text-white">
                    <td className="px-6 py-4">{categoria.id}</td>
                    <td className="px-6 py-4">
                        {editandoId === categoria.id ? (
                        <input
                            type="text"
                            value={novoNome}
                            onChange={(e) => setNovoNome(e.target.value)}
                            className="bg-gray-800 border rounded px-2 py-1 text-white"
                        />
                        ) : (
                        categoria.nome
                        )}
                    </td>
                    <td className="py-4 flex gap-2">
                        {editandoId === categoria.id ? (
                        <button
                            className="bg-green-600 px-3 py-1 rounded font-semibold"
                            onClick={() => salvarCategoria(categoria.id)}
                        >
                            Salvar
                        </button>
                        ) : (
                        <button
                            className="bg-cyan-700 px-3 py-1 rounded font-semibold"
                            onClick={() => {
                            setEditandoId(categoria.id);
                            setNovoNome(categoria.nome);
                            }}
                        >
                            Editar
                        </button>
                        )}
                    <button
                        className="bg-red-600 px-3 py-1 rounded font-semibold"
                        onClick={() => deletarCategoria(categoria.id)}
                    >
                            Apagar
                    </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
            <div className="mt-4 flex gap-2">
                <input
                    type="text"
                    placeholder="Novo gênero"
                    value={novoNome}
                    onChange={(e) => setNovoNome(e.target.value)}
                    className="flex-1 rounded px-3 py-2 bg-gray-800 text-white border"
                />
                <button
                    onClick={adicionarCategoria}
                    className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
                >
                    Adicionar
                </button>
                </div>
        </div>
        </div>
    </div>
</div>
    );
};
  
  export default AdminDashboard;