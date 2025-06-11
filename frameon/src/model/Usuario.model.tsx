export interface UsuarioModel {
    id: any,
    nome: string;
    email: string;
    senha: string,
    dOB: {
    startDate: string | null;
    endDate: string | null;
  };
}