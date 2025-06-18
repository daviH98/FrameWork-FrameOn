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
    const token = localStorage.getItem('token');

    return await fetch(`http://localhost:8080/api/usuario/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    }) .then((response) => response.json());
}

const login = async (email: string, senha: string) => {
    const response = await fetch(`http://localhost:8080/api/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email:email,
            senha:senha
        }),
    });

    let data;

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        data = await response.json();
    }

    if (!response.ok) {
        throw new Error(data?.message || 'Erro ao fazer login.');
    }

    localStorage.setItem('token', data.token);
    return data;
}

const apagar = async (id: string) => {
    const token = localStorage.getItem('token');

    try {
    const response = await fetch(`http://localhost:8080/api/usuario/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response) {
        console.error("Nenhuma resposta recebida do servidor.");
        throw new Error("Erro de rede ou resposta inválida.");
    }

    if (!response.ok) {
        console.error("Erro ao deletar usuário:", response.status);
        throw new Error("Erro ao deletar usuário");
      }
    
    if (response.status === 204) {
        console.log("Usuário deletado com sucesso.");
        return;
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (!response.ok) {
            console.error("Erro na exclusão:", data.message || data);
            throw new Error(data.message || "Erro desconhecido ao excluir.");
          }
    
          console.log("Resposta do backend:", data);
          return data;
        } else {
          console.warn("Resposta inesperada do servidor, sem JSON.");
        }
    
      } catch (error) {
        console.error("Erro ao apagar usuário:", error);
        throw error;
      }
}

const userService = {
    salvar,
    listar,
    buscarPorId,
    login,
    apagar
};

export default userService