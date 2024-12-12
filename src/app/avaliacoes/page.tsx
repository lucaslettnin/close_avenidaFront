'use client'
import './page.css';
import { useEffect, useState } from "react";
import { useClienteStore } from "@/context/cliente";
import { AvaliacaoI } from "@/utils/types/avaliacoes";

export default function Avaliacao() {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoI[]>([]);
  const { cliente } = useClienteStore();

  useEffect(() => {
    async function buscaDados() {
      if (cliente.id) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/avaliacoes/${cliente.id}`);
        const dados = await response.json();
        setAvaliacoes(dados);
      }
    }
    buscaDados();
  }, [cliente.id]);

  // Função para formatar a data do campo no banco de dados
  function dataDMA(data: string) {
    const ano = data.substring(0, 4);
    const mes = data.substring(5, 7);
    const dia = data.substring(8, 10);
    return `${dia}/${mes}/${ano}`;
  }

  // Função para renderizar estrelas
  function renderizaEstrelas(estrelas: number) {
    const totalEstrelas = 5; // Total de estrelas possíveis
    const estrelasAtivas = "⭐".repeat(estrelas);  // Estrelas preenchidas
    const estrelasInativas = "☆".repeat(totalEstrelas - estrelas);  // Estrelas não preenchidas
    return (
      <span className="text-yellow-400">
        {estrelasAtivas}
        <span className="text-gray-300">{estrelasInativas}</span>
      </span>
    );
  }

  const avaliacoesTable = avaliacoes.map(avaliacao => (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={avaliacao.id}>
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {avaliacao.produto.modelo}
      </th>
      <td className="px-6 py-4">
        <img src={avaliacao.produto.foto} className="fotoCarro" alt="Foto Produto" />
      </td>
      <td className="px-6 py-4">
        {renderizaEstrelas(avaliacao.estrelas)} {/* Exibe as estrelas */}
        <p><b>{avaliacao.comentario}</b></p>
        <p><i>Enviado em: {dataDMA(avaliacao.createdAt)}</i></p>
      </td>

      
    </tr>
  ));

  return (
    <section className="max-w-7xl mx-auto">
      <h1 className="mb-6 mt-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
        Listagem de <h1 className="mt-2 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-dark"><span className="underline underline-offset-3 decoration-8 decoration-orange-400 dark:decoration-yellow-300">Minhas Avaliações</span></h1>
      </h1>

      {avaliacoes.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Nenhuma avaliação encontrada.</p>
      ) : (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Modelo do Produto</th>
              <th scope="col" className="px-6 py-3">Foto</th>
              <th scope="col" className="px-6 py-3">Comentário e Estrelas</th>


            </tr>
          </thead>
          <tbody>
            {avaliacoesTable}
          </tbody>
        </table>
      )}
    </section>
  );
}
