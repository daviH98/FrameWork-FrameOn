import { constants } from "os";
import React, { useEffect, useState } from "react";
import { UsuarioModel } from "../../model/Usuario.model";
import userService from "../../service/userService";
import { useNavigate } from "react-router-dom";


const ListaUsers: React.FC<{}> = ({}) => {

    const[usuarios, setUsuarios] = useState<UsuarioModel[]>();

    const navigate = useNavigate();

    const buscarUsuarios = () => {
        userService.listar().then(usuarios => {
            setUsuarios(usuarios);
        });
    }

    const carregar = (id: number) => {
        navigate(`/usuario/${id}`); 
    }

    return (
       <div>
        <button onClick={buscarUsuarios} type="button">Pesquisar</button>
            <table className="table-auto">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Email</th>
                    <th scope="col">Senha</th>
                    <th scope="col">Data de Nascimento</th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        usuarios?.map(usuario => {
                            return (
                                <tr>
                                    <th scope="row">{usuario.id}</th>
                                    <td>{usuario.nome}</td>
                                    <td>{usuario.email}</td>
                                    <td>{usuario.senha}</td>
                                    <td>{usuario.dOB?.startDate ?? null}</td>
                                    <td><button type="button" onClick={() => { carregar(usuario.id)}}>Carregar</button></td>
                                </tr>
                            )
                        })
                
                    }
                </tbody>
                </table>
       </div>
       
    );
}

export default ListaUsers;
