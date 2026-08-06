export interface Usuario {
  id: number;
  nome: string;
  email: string;
  dataCriacao: string;
}

export interface UsuarioCreateRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface UsuarioUpdateRequest {
  nome: string;
  email: string;
  senha?: string;
}
