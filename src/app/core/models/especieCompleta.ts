export interface EspecieCompleta {
  status_validacao: string;
  taxon: {
    reino: string;
    divisao: string;
    familia: string;
    genero: string;
    especie: string;
    autor: string;
    nome_comum_confirmado: string;
  };
  geografia: {
    municipio: string;
    uf: string;
    bioma: string;
  };
  ecologia: {
    status_conservacao: string;
    origem: string;
    importancia_ecologica: string;
  };
}
