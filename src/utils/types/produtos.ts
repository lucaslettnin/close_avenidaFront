export interface ProdutoI {
  id: number
  modelo: string
  preco: number
  foto: string
  acessorios: string
  conectividade: string
  memoria_ram: string
  cpu: string
  descricao: string
  destaque: boolean
  createdAt: Date
  updatedAt: Date
}
