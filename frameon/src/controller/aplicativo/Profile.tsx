import React, { useEffect, useState } from "react";
import Modal from "../../assets/modal";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import userService from "../../service/userService";

const Profile: React.FC<{}> = ({}) => {
  const [usuario, setUsuario] = useState<any>(null);
  const [editando, setEditando] = useState(false);
  const [modalSuccess, setSuccess] = useState<string | null>(null);
  const[openOnSuccess, setOpenOnSuccess] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [deveRedirecionar, setDeveRedirecionar] = useState(false);
  const [idToDelete, setIdToDelete] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [modalError, setModalError] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    dOB: "",
    senha: "",
  });

  const formatarData = (iso: string) => {
    const [ano, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const handleDeleteClick = (id: string) => {
    setIdToDelete(id);
    setOpenConfirmModal(true);
  };

  const onErrors = (errors: any) => {
    const firstErrorField = Object.keys(errors)[0];
    const firstErrorMessage = errors[firstErrorField]?.message || 'Erro desconhecido';
  
    setModalError(firstErrorMessage);
    setOpen(true);
  };

  useEffect(() => {
    const carregarUsuario = async () => {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token!.split(".")[1]));
      const id = payload.id;

      const response = await fetch(`http://localhost:8080/api/usuario/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204 || response.status === 404) {
        alert("Usuário não encontrado ou foi deletado.");
        // Opcional: redirecionar para login ou outra página
        return;
      }

      if (!response.ok) {
        alert(`Erro ao carregar usuário: ${response.statusText}`);
        return;
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!data) {
        console.error("Resposta vazia do servidor");
        return;
      }

      if (data.dOB) {
        data.dOB = data.dOB.split("T")[0];
      }

      setUsuario(data);
      setFormData({
        nome: data.nome,
        email: data.email,
        dOB: data.dOB?.substring(0, 10) ?? "",
        senha: data.senha,
      });
    };

    carregarUsuario();
  }, []);

  const salvarEdicao = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:8080/api/usuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...formData, id: usuario.id, role: usuario.role }),
    });

    if (response.ok) {
      const result = await response.json();
      setUsuario({ ...usuario, ...formData });
      setEditando(false);
      localStorage.setItem("token", result.token); // atualiza token se necessário
      setSuccess('Edição salva com sucesso.');
      setDeveRedirecionar(false); 
      setOpenOnSuccess(true);
    } else {
      console.error("Erro ao salvar perfil");
    }
  };

  const deleteUser = async(id: string | null) => {
      if (!id) return;
      setOpenConfirmModal(false);
      console.log("chamou o excluir");
      console.log(id);
      try {
        const result = await userService.apagar(idToDelete);
        console.log("Resultado:", result);

        setSuccess('Conta apagada com sucesso. Até a próxima!');
        setDeveRedirecionar(true);
        setOpenOnSuccess(true);
      } catch (error: any) {
        console.error("Erro ao excluir:", error);
        setModalError(error.message);
        setOpen(true);
      }
    };

  if (!usuario) return <p className="text-2xl font-bold mb-4">Carregando...</p>;

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
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-50 text-white">
      <Modal open={openOnSuccess} onClose={() => {setOpenOnSuccess(false);if (deveRedirecionar) { navigate('/'); }}}>
        <div className="flex flex-col items-center justify-center bg-gray-900 p-6 rounded-lg w-64">
          <CheckCircleIcon className="h-8 w-8 text-green-600 mb-2" />
          <div className="text-center">
            <h3 className="text-lg font-black text-white">Sucesso!</h3>
            <p className="text-sm text-white mt-2">{modalSuccess}</p>
          </div>
        </div>
      </Modal>

      <Modal open={openConfirmModal} onClose={() => {setOpenConfirmModal(false)}}>
        <div className="flex flex-col items-center justify-center bg-gray-900 p-6 rounded-lg w-64">
          <h3 className="text-lg font-black text-white">Confirmar Exclusão</h3>
          <p className="text-sm text-white mt-2">Deseja realmente excluir o usuário?</p>

          <div className="mt-4 flex gap-4">
            <button
              className="px-4 py-2 bg-red-600 rounded text-white hover:bg-red-400"
              onClick={() => deleteUser(idToDelete)}
            >
              Sim
            </button>
            <button
              className="px-4 py-2 bg-gray-600 rounded text-white hover:bg-gray-400"
              onClick={() => setOpenConfirmModal(false)}
            >
              Não
            </button>
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
      
        <div className="p-8 bg-gray-900 rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-2xl font-bold mb-4">Editar Perfil</h1>

            <div className="space-y-4">
                <div>
                <label className="block font-semibold">Nome:</label>
                {editando ? (
                    <input
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="bg-gray-800 border rounded px-2 py-1 w-full"
                    />
                ) : (
                    <p>{usuario.nome}</p>
                )}
                </div>

                <div>
                <label className="block font-semibold">Email:</label>
                {editando ? (
                    <input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-gray-800 border rounded px-2 py-1 w-full"
                    />
                ) : (
                    <p>{usuario.email}</p>
                )}
                </div>

                <div>
                <label className="block font-semibold">Data de Nascimento:</label>
                {editando ? (
                    <input
                    type="date"
                    value={formData.dOB}
                    onChange={(e) => setFormData({ ...formData, dOB: e.target.value })}
                    className="bg-gray-800 border rounded px-2 py-1 w-full"
                    />
                ) : (
                    <p>{formatarData(usuario.dOB)}</p>
                )}
                </div>

                {editando && (
                <div>
                    <label className="block font-semibold">Senha:</label>
                    <input
                    type="password"
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    className="bg-gray-800 border rounded px-2 py-1 w-full"
                    />
                </div>
                )}
            </div>

            <div className="mt-6 flex justify-between items-center">
                {editando ? (
                <button
                    className="bg-green-600 px-4 py-2 rounded font-semibold hover:bg-green-400"
                    onClick={salvarEdicao}
                >
                    Salvar
                </button>
                ) : (
                <button
                    className="bg-yellow-700 px-4 py-2 rounded font-semibold hover:bg-yellow-500"
                    onClick={() => setEditando(true)}
                >
                    Editar
                </button>
                )}
                <button
                    className="bg-red-600 px-4 py-2 rounded font-semibold hover:bg-red-400"
                    onClick={() => handleDeleteClick(usuario.id)}
                >
                    Apagar
                </button>
                <button
                    className="bg-gray-600 px-4 py-2 rounded font-semibold hover:bg-gray-400"
                    onClick={() => navigate('/home')}
                >
                    Voltar
                </button>
            </div>
        </div>
    </div>
</div>
  );
};

export default Profile;
