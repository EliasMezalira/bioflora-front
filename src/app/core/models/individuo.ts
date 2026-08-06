export interface Individuo {
  id: number;
  parcela: string;
  nomePopular?: string;
  nomeCientifico?: string;
  diametroCaule?: number;
  vivoMorto: 'vivo' | 'morto';
  dataLevantamento: string;
  levantamentoId: number;
}

export interface IndividuoCreateRequest {
  parcela: string;
  nomePopular?: string;
  nomeCientifico?: string;
  diametroCaule?: number;
  vivoMorto: 'vivo' | 'morto';
  dataLevantamento: string;
}
