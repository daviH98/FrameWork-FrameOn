// src/Home.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filme } from './model/Filme.model';
import logo from "./assets/logo.png";
import test from "./assets/missao-impossivel.jpg";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon, UserCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { HeartIcon, PlayIcon } from '@heroicons/react/24/solid';
import Modal from './assets/modal.jsx';
import Card from './assets/card';
import filmeService from './service/filmeService';

const Home: React.FC<{}> = ({}) =>  {
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
  
  const navigation = [
    { name: 'Catálogo', href: '/', current: true },
    { name: 'Sobre', href: '/sobre', current: false },
    { name: 'Favoritos', href: '/alugados', current: false },
  ]
  
  function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
  }

  const [modalSuccess, setSuccess] = useState<string | null>(null);
  const[open, setOpen] = useState(false);
  const[openOnSuccess, setOpenOnSuccess] = useState(false);
  
  const signOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    localStorage.removeItem('token');
    setSuccess('Você saiu da sua conta.');
    setOpenOnSuccess(true);
  };

  useEffect(() => {
    buscarFilmes();
  }, []);

  return (
    <div
        className="min-h-screen"
        style={{
          backgroundImage: `url('/funda.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
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

      {/* Lista de Filmes */}
      <div className="max-w-7xl mx-auto px-20">
        <div className="py-20 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filmes?.map((filme: Filme) => {
          console.log("Filmes:", filmes);
          console.log(filme.ano)
          console.log(filme.categoria_id)

          return (
            <Card imgSrc={filme.capa} key={filme.id}>
              <h3 className="text-l font-bold mb-2 drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">{filme.nome}</h3>
              <p className='drop-shadow-[0_2px_2px_rgba(0,0,0,1)]'>
                {filme.ano} • {filme.categoria}
              </p>
              <div className="space-x-24 mt-4">
                <button>
                  <PlayIcon className="h-8 w-8 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,1)]" />
                </button>
                <button>
                  <HeartIcon className="h-8 w-8 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,1)]" />
                </button>
              </div>
            </Card>
          );
        })}
        </div>
      </div>
      </div>
  );
}

export default Home;
