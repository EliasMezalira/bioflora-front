export interface Levantamento {
  id: number;
  nome: string;
  bioma: string;
  descricao?: string;
  cidade: string;
  estado: string;
  pais: string;
  dataCriacao: string;
  dataAtualizacao: string;
  usuarioId: number;
}

export interface LevantamentoCreateRequest {
  nome: string;
  bioma: string;
  descricao?: string;
  cidade: string;
  estado: string;
  pais: string;
}
