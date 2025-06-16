import { Filme } from "../model/Filme.model";

const salvarF = async (filme: Filme) => {
    const data = {
        nome: filme.nome,
        ano: filme.ano, 
        genero: filme.genero,
        capa: filme.capa,
      };

    return await fetch(`http://localhost:8080/api/filme`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json());
}

const listar = async (): Promise<Filme[]> => {
    const token = localStorage.getItem('token');

    return await fetch(`http://localhost:8080/api/filme`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            // "Authorization":`Bearer ${token}`
        }
    }) .then((response) => response.json());
}

const buscarPorId = async (id: string) => {
    return await fetch(`http://localhost:8080/api/filme/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
    }) .then((response) => response.json());
}

const apagar = async (id: string) => {
    return await fetch(`http://localhost:8080/api/filme/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    }) .then((response) => response.json());
}


const uploadArquivo = async (arquivo: any) => {
    return await fetch(`http://localhost:8080/api/upload`, {
        method: "POST",
        body: arquivo,
    })
        .then((response) => response.json());
}

const filmeService = {
    salvarF,
    listar,
    buscarPorId,
    apagar,
    uploadArquivo
};

export default filmeService