import { ProdutoI } from "@/utils/types/produtos"
import { set, useForm } from "react-hook-form"
import { toast } from "sonner"

type Inputs = {
  termo: string
}

type InputPesquisaProps = {
  setProdutos: React.Dispatch<React.SetStateAction<ProdutoI[]>>
}

export function InputPesquisa({ setProdutos }: InputPesquisaProps) {
  
  const { register, handleSubmit, reset } = useForm<Inputs>()

  async function enviaPesquisa(data: Inputs) {
    if (data.termo.length < 2) {
      toast.warning("Informe, no mínimo, 2 caracteres para a pesquisa")
      return
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/produtos/pesquisa/${data.termo}`)
    const dados = await response.json()
    if (dados.length == 0) {
      toast.error("Não há produtos com o termo informado... Realize nova pesquisa.")
      reset({ termo: "" }) 
      return
    }
    setProdutos(dados)
  }

  async function mostraDestaques() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/produtos`)
    const dados = await response.json()
    setProdutos(dados)    
    reset({ termo: "" }) 
  }

  return (
    <div className="flex max-w-5xl mx-auto mt-3">
      <form className="flex-1" onSubmit={handleSubmit(enviaPesquisa)}>
        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-yellow-500"
            placeholder=""
            {...register("termo")} 
            required
          />
          <button
            type="submit"
            className="text-dark absolute end-2.5 bottom-2.5 bg-yellow-300 hover:bg-yellow-300 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-yellow-400 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
          >
            Buscar
          </button>
        </div>
      </form>

      <button
  type="button"
  className="ms-3 mt-2 focus:outline-none text-dark bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-800 font-extrabold rounded-lg text-sm px-5 py-2.5 mb-2 border-2 dark:bg-yellow-300 dark:hover:bg-yellow-400 dark:focus:ring-yellow-300"
  onClick={mostraDestaques}
>
  Produtos em Destaque
</button>

    </div>
  )
}