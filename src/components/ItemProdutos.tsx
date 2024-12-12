import { ProdutoI } from "@/utils/types/produtos";
import Link from "next/link";

export
function ItemProdutos({data}: {data: ProdutoI}) {
  return (
    <div className="mt-3 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <img className="rounded-t-lg" 
        src={data.foto} alt={`Imagem do ${data.modelo}`} />
      <div className="p-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {data.modelo}
        </h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {data.acessorios}
        </p>
        <p className="mb-3 font-bold text-gray-700 dark:text-gray-400">
          Preço R$ {Number(data.preco).toLocaleString("pt-br", 
                                  {minimumFractionDigits: 2})}
        </p>
        <Link href={`/detalhes/${data.id}`} type="button" className="px-3 py-2 text-xs font-medium text-center text-dark bg-yellow-400 rounded-lg hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-400 dark:bg-yellow-400 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800">
          Ver detalhes
        </Link>
      </div>
    </div>
  )
}