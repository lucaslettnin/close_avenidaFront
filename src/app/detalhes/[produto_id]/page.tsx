"use client";
import { ProdutoI } from "@/utils/types/produtos";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useClienteStore } from "@/context/cliente";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Inputs = {
  comentario: string;
  avaliacao: number; // O valor da avaliação será um número inteiro
};

export default function Detalhes() {
  const params = useParams();
  const { cliente } = useClienteStore();
  const [produto, setProduto] = useState<ProdutoI>();
  const [avaliacao, setAvaliacao] = useState(5); // Inicializa com 5 estrelas
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const [mediaAvaliacoes, setMediaAvaliacoes] = useState<number | null>(null); // Para armazenar a média
  const [totalAvaliacoes, setTotalAvaliacoes] = useState<number>(0); // Total de avaliações

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/produtos/${params.produto_id}`);
      const dados = await response.json();
      setProduto(dados);

      // Busca as avaliações do produto
      const responseAvaliacoes = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/avaliacoes?produtoId=${params.produto_id}`);
      const avaliacoesData = await responseAvaliacoes.json();

      if (avaliacoesData.length > 0) {
        // Calcula a média das avaliações
        const totalEstrelas = avaliacoesData.reduce((total: any, avaliacao: { estrelas: any; }) => total + avaliacao.estrelas, 0);
        const media = totalEstrelas / avaliacoesData.length;
        setMediaAvaliacoes(media);
        setTotalAvaliacoes(avaliacoesData.length);
      }
    }
    buscaDados();
  }, [params.produto_id]);

  async function enviaAvaliacao(data: Inputs) {
    const { comentario } = data;
    const estrelas = avaliacao; // Usa o valor do estado para estrelas

    // Validação básica antes de enviar
    if (typeof cliente.id !== "string" || !cliente.id) {
      toast.error("Cliente ID inválido.");
      return;
    }
    if (!Number.isInteger(Number(params.produto_id))) {
      toast.error("Produto ID deve ser um número.");
      return;
    }
    if (estrelas < 1 || estrelas > 5) {
      toast.error("Avaliação deve ser entre 1 e 5.");
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/avaliacoes`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        clienteId: cliente.id,
        produtoId: Number(params.produto_id),
        comentario: comentario,
        estrelas: estrelas,
      }),
    });

    if (response.status === 201) {
      toast.success("Obrigado. Sua avaliação foi enviada.", {
        duration: 2000, // Exibe a mensagem por 2 segundos
      });
      reset();
      setAvaliacao(5); // Reseta as estrelas após envio
    } else {
      const errorData = await response.json();
      toast.error(`Erro... Não foi possível enviar sua avaliação: ${errorData.message}`);
    }
  }

  function handleStarClick(index: number) {
    setAvaliacao(index); // Define o número de estrelas baseado no clique
  }

  return (
    <>
      <section className="flex mt-6 mx-auto flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-5xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
        <img className="object-cover w-full rounded-t-lg h-96 md:h-2/4 md:w-2/4 md:rounded-none md:rounded-s-lg" src={produto?.foto} alt="Foto do Produto" />
        <div className="flex flex-col justify-between p-4 leading-normal">
          <h5 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
            Colaboradora vestindo 
          </h5>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {produto?.modelo}
          </h5>
          <h5 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
            Preço: R$ {Number(produto?.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
          </h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {produto?.descricao}
          </p>
          
          {/* Exibe a média das avaliações e o número total */}
          {mediaAvaliacoes !== null && (
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Avaliações: {mediaAvaliacoes.toFixed(1)}/5 - ({totalAvaliacoes} avaliações)
            </p>
          )}

          {cliente.id ? (
            <>
              <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Gostou deste Produto? Deixe sua Avaliação!</h3>
              <form onSubmit={handleSubmit(enviaAvaliacao)}>
                <textarea
                  id="comentario"
                  className="mb-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Deixe seu comentário sobre o produto"
                  required
                  {...register("comentario")}
                ></textarea>
                
                {/* Avaliação com estrelas clicáveis */}
                <div className="mb-2">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Avaliação:</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <StarIcon
                        key={index}
                        filled={index <= avaliacao}
                        onClick={() => handleStarClick(index)}
                      />
                    ))}
                  </div>
                </div>

                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Enviar Avaliação</button>
              </form>
            </>
          ) : (
            <h3 className="text-xl font-bold tracking-tight text-orange-600 dark:text-white">Para avaliar você precisa estar logado!</h3>
          )}
        </div>
      </section>
    </>
  );
}

type StarIconProps = {
  filled: boolean;
  onClick: () => void;
};

function StarIcon({ filled, onClick }: StarIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={filled ? "yellow" : "none"}
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6 cursor-pointer"
      onClick={onClick}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 17.27l6.18 3.73-1.64-7.03L21.5 8.9l-7.19-.61L12 2.5l-2.31 5.79-7.19.61 5.96 5.07L5.82 21z"
      />
    </svg>
  );
}
