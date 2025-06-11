import { UsuarioModel } from "../model/Usuario.model";

const salvar = async (usuario?: UsuarioModel) => {
    return await fetch(`http://localhost:8080/api/usuario`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
    })
        .then((response) => response.json());
}

const listar = async () => {
    const token = localStorage.getItem('token');

    return await fetch(`http://localhost:8080/api/usuario`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization":`Bearer ${token}`
        }
    }) .then((response) => response.json());
}

const buscarPorId = async (id: string) => {
    return await fetch(`http://localhost:8080/api/usuario/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    }) .then((response) => response.json());
}

const login = async (email: string, senha: string) => {
    return await fetch(`http://localhost:8080/api/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email:email,
            senha:senha
        }),
    })
        .then((response) => response.json());
}

const uploadArquivo = async (arquivo: any) => {
    return await fetch(`http://localhost:8080/api/upload`, {
        method: "POST",
        body: arquivo,
    })
        .then((response) => response.json());
}

const userService = {
    salvar,
    listar,
    buscarPorId,
    login,
    uploadArquivo
};

export default userService