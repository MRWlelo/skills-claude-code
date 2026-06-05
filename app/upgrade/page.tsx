"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Scale, CheckCircle, Loader2, ArrowLeft, Zap, Crown } from "lucide-react";

export default function UpgradePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<"pro" | "avulso" | null>(null);

  async function handleCheckout(tipo: "pro" | "avulso") {
    setLoading(tipo);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo }),
    });
    const data = await res.json();
    if (data.url) {
      router.push(data.url);
    } else {
      alert(data.error ?? "Erro ao iniciar pagamento");
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Nav */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm">
            <ArrowLeft className="w-4 h-4" /> Voltar ao dashboard
          </Link>
          <div className="flex items-center gap-2">
            <Scale className="text-green-700 w-5 h-5" />
            <span className="font-bold text-gray-900">AgroLegal</span>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Escolha seu plano</h1>
          <p className="text-gray-500 mt-3">
            Você usou seu contrato gratuito. Continue gerando contratos profissionais.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Avulso */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-amber-500" />
              <span className="font-semibold text-gray-900">Avulso</span>
            </div>
            <p className="text-4xl font-bold text-gray-900">R$49</p>
            <p className="text-gray-400 text-sm mt-1">por contrato</p>
            <p className="text-gray-500 text-sm mt-4 mb-6">
              Compre créditos conforme precisar. Cada crédito gera 1 contrato completo.
            </p>
            <ul className="space-y-2 mb-8">
              {[
                "1 contrato gerado com IA",
                "Download em TXT",
                "Salvo no seu histórico",
                "Sem prazo de validade",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout("avulso")}
              disabled={loading !== null}
              className="w-full border border-green-700 text-green-700 py-3 rounded-xl font-semibold text-sm hover:bg-green-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading === "avulso" ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Redirecionando...</>
              ) : (
                "Comprar 1 crédito — R$49"
              )}
            </button>
          </div>

          {/* Pro */}
          <div className="bg-green-700 border border-green-700 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">Escritório</span>
              </div>
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                MAIS POPULAR
              </span>
            </div>
            <p className="text-4xl font-bold">R$499</p>
            <p className="text-green-200 text-sm mt-1">por mês</p>
            <p className="text-green-100 text-sm mt-4 mb-6">
              Contratos ilimitados para advogados e escritórios agrários. Cancele quando quiser.
            </p>
            <ul className="space-y-2 mb-8">
              {[
                "Contratos ilimitados",
                "Todos os tipos de contrato",
                "Dashboard completo",
                "Histórico permanente",
                "Cancele a qualquer momento",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-green-100">
                  <CheckCircle className="w-4 h-4 text-green-300 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout("pro")}
              disabled={loading !== null}
              className="w-full bg-white text-green-700 py-3 rounded-xl font-semibold text-sm hover:bg-green-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading === "pro" ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Redirecionando...</>
              ) : (
                "Assinar Escritório — R$499/mês"
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Pagamento seguro via Stripe • Cancele quando quiser • Suporte em português
        </p>
      </div>
    </div>
  );
}
