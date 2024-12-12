import { ProdutoI } from "./produtos";
import { ClienteI } from "./clientes";

export interface AvaliacaoI {
  id: number;
  clienteId: string;
  cliente: ClienteI;
  produtoId: number; 
  produto: ProdutoI;
  estrelas: number; 
  comentario: string | null; 
  resposta: string | null;
  createdAt: string;
  updatedAt: string | null;
}
