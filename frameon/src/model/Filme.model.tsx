export interface Filme {
    id: any,
    nome: string;
    ano: string | null;
    genero?: string;
    capa: string | null;
    categoria_id: any;
    categoria?: string; 
  }