import { error } from "console";
import { Filme } from "../model/Filme.model";
const token = localStorage.getItem("token");

const salvarF = async (filme: Filme) => {
    const data = {
        id: filme.id,
        nome: filme.nome,
        ano: filme.ano, 
        capa: filme.capa,
        categoria_id: filme.categoria_id,
      };

    return await fetch(`http://localhost:8080/api/filme`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
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
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:8080/api/filme/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        console.error('Erro ao carregar filme:', response.status);
        return;
      }

    const filme = await response.json();
    console.log(filme);
    return filme;
}

const apagar = async (id: string) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:8080/api/filme/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        console.error('Erro ao deletar filme:', response.status);
        return;
      }

    const filme = await response.json();
    console.log(filme);
    return filme;
}

const listarCategorias = async () => {
    const response = await fetch("http://localhost:8080/api/categorias", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  
    if (!response.ok) {
      throw new Error("Erro ao buscar categorias");
    }
  
    return response.json();
  };

const uploadArquivo = async (arquivo: any) => {
    return await fetch(`http://localhost:8080/api/upload`, {
        method: "POST",
        body: arquivo,
    })
        .then((response) => response.json());
};

const favoritar = async (id: any) => {
    const response = await fetch(`http://localhost:8080/api/filme/${id}/favorito`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
        throw new Error("Erro ao favoritar");
      }
    
      const data = await response.json();
      return data;
}

const filmeService = {
    salvarF,
    listar,
    buscarPorId,
    apagar,
    listarCategorias,
    uploadArquivo,
    favoritar
};

export default filmeService