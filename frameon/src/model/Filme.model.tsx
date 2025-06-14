export interface Filme {
    id: any,
    nome: string;
    ano: {
      startDate: string | null;
      endDate: string | null;
    };
    genero?: string;
    capa: string | null;
  }