'use client'
import { InputPesquisa } from "@/components/InputPesquisa"
import { ItemProdutos } from "@/components/ItemProdutos";
import { ProdutoI } from "@/utils/types/produtos";
import { useEffect, useState } from "react";
import { Toaster } from 'sonner'
import { useClienteStore } from "@/context/cliente";

export default
function Home() {
  const [produtos, setProdutos] = useState<ProdutoI[]>([])
  const { logaCliente } = useClienteStore()

  useEffect(() => {

    async function buscaCliente(idCliente: string) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/clientes/${idCliente}`)
      if (response.status == 200) {
        const dados = await response.json()
        logaCliente(dados)
      }
    }

    if (localStorage.getItem("client_key")) {
      const idClienteLocal = localStorage.getItem("client_key") as string
      buscaCliente(idClienteLocal)
    }

    async function getDados() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/produtos`)
      const dados = await response.json()
      console.log(dados)
      setProdutos(dados)
    }
    getDados()
  }, [])

  const listaProdutos = produtos.map( produto => (
    <ItemProdutos data={produto} key={produto.id} /> 
  ))

  return (
    <>
      <InputPesquisa setProdutos={setProdutos} />
      <div className="mx-auto max-w-screen-xl">
        <h1 className="mt-2 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-dark"><span className="underline underline-offset-3 decoration-8 decoration-orange-400 dark:decoration-yellow-300">Produtos em destaque</span></h1>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {listaProdutos}
        </section>
      </div>
      <Toaster position="top-right" richColors />
    </>
  );
}