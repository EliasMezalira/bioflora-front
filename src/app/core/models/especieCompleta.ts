export interface EspecieCompleta {
  statusValidacao: string;
  taxon: {
    reino: string;
    divisao: string;
    familia: string;
    genero: string;
    especie: string;
    autor: string;
    nomeComumConfirmado: string;
  };
  geografia: {
    municipio: string;
    uf: string;
    bioma: string;
  };
  ecologia: {
    statusConservacao: string;
    origem: string;
    importanciaEcologica: string;
  };
}
