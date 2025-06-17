import { constants } from "os";
import React, { useEffect, useState } from "react";
import { UsuarioModel } from "../../model/Usuario.model";
import userService from "../../service/userService";
import { useNavigate } from "react-router-dom";
import Usuario from "./Cadastro";


const ListaUsers: React.FC<{}> = ({}) => {

    const[usuarios, setUsuarios] = useState<UsuarioModel[]>([]);

    const navigate = useNavigate();

    const buscarUsuarios = () => {
        userService.listar().then((usuarios: UsuarioModel[]) => {
          const userConvertidos = usuarios.map((usuario) => {
        
            return { ...usuario};
          });
      
          setUsuarios(userConvertidos);
        });
      };

      const deleteUser = async(id: any) => {
        if(!window.confirm("Deseja excluir?")) {return;} else {
          console.log("chamou o excluir");
          console.log(id);
          try {
          const response = await fetch(`http://localhost:8080/api/usuario/${id}`, {
              method: "DELETE",
              headers: {
                  "Content-Type": "application/json",
              }
          });
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const result = await response.json();
  
            if (response.ok) {
              alert("Usuário deletado com sucesso!");
              window.location.reload();
            } else {
              alert(`Erro: ${result.message}`);
            }
          } else {
            // A resposta não é JSON
            const text = await response.text();
            console.warn("Resposta inesperada:", text);
            alert("Erro inesperado ao excluir o usuário.");
          }
  
        } catch (error) {
          console.error(error);
          alert("Erro ao excluir o usuário.");
        }
      }
    }

    const carregar = (id: number) => {
        navigate(`/usuario/${id}`); 
    }

    return (
        <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
            <button className="text-white" onClick={buscarUsuarios} type="button">Pesquisar</button>
              <table className="min-w-full text-left text-sm font-light">
                <thead className="border-b font-medium dark:border-neutral-500 text-white">
                  <tr>
                    <th scope="col" className="px-6 py-4">#</th>
                    <th scope="col" className="px-6 py-4">Nome</th>
                    <th scope="col" className="px-6 py-4">Data de Nascimento</th>
                    <th scope="col" className="px-6 py-4">Email</th>
                    <th scope="col" className="px-6 py-4">Senha</th>
                    <th scope="col" className="px-6 py-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    usuarios?.map((usuarios: UsuarioModel) =>  {
                      {console.log(usuarios.dOB)}
                      return (
                          <tr key={usuarios.id} className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
                              <th className="-nowrap px-6 py-4 font-medium text-white">{usuarios.id}</th>
                              <td className="-nowrap px-6 py-4 text-white">{usuarios.nome}</td>
                              <td className="-nowrap px-6 py-4 text-white">{usuarios.dOB.toString()}</td>
                              <td className="-nowrap px-6 py-4 text-white">{usuarios.email}</td>
                              <td className="-nowrap px-6 py-4 text-white">{usuarios.senha}</td>
                              <td><button type="button" className="justify-center rounded-md bg-cyan-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-cyan-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={() => { carregar(usuarios.id)}}>Carregar</button></td>
                              <td><button type="button" className="justify-center rounded-md bg-red-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={() => { deleteUser(usuarios.id)}}>Apagar</button></td>
                          </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
}

export default ListaUsers;
