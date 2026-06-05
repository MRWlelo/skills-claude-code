"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Scale, ArrowLeft, FileText, Loader2, Download, AlertCircle, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";

const TIPOS_CONTRATO = [
  { value: "arrendamento_rural", label: "Arrendamento Rural" },
  { value: "parceria_agricola", label: "Parceria Agrícola" },
  { value: "parceria_pecuaria", label: "Parceria Pecuária" },
  { value: "comodato_rural", label: "Comodato Rural" },
  { value: "compra_venda_imovel_rural", label: "Compra e Venda de Imóvel Rural" },
  { value: "cessao_uso", label: "Cessão de Uso" },
  { value: "aforamento_rural", label: "Aforamento Rural" },
  { value: "permuta_imoveis_rurais", label: "Permuta de Imóveis Rurais" },
  { value: "arrendamento_opcao_compra", label: "Arrendamento com Opção de Compra" },
  { value: "contrato_meacao", label: "Contrato de Meação" },
];

const ESTADOS_BR = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

interface FormData {
  tipo_contrato: string;
  // Partes
  arrendador_nome: string;
  arrendador_cpf_cnpj: string;
  arrendatario_nome: string;
  arrendatario_cpf_cnpj: string;
  // Imóvel
  imovel_nome: string;
  imovel_municipio: string;
  imovel_estado: string;
  imovel_area: string;
  imovel_matricula: string;
  imovel_car: string;
  // Contrato
  prazo_anos: string;
  valor_arrendamento: string;
  forma_pagamento: string;
  uso_destinado: string;
  observacoes: string;
}

const initialForm: FormData = {
  tipo_contrato: "arrendamento_rural",
  arrendador_nome: "",
  arrendador_cpf_cnpj: "",
  arrendatario_nome: "",
  arrendatario_cpf_cnpj: "",
  imovel_nome: "",
  imovel_municipio: "",
  imovel_estado: "MT",
  imovel_area: "",
  imovel_matricula: "",
  imovel_car: "",
  prazo_anos: "",
  valor_arrendamento: "",
  forma_pagamento: "anual",
  uso_destinado: "",
  observacoes: "",
};

export default function AppPage() {
  const { data: session } = useSession();
  const [form, setForm] = useState<FormData>(initialForm);
  const [resultado, setResultado] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [gerado, setGerado] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro("");
    setResultado("");
    setGerado(false);

    try {
      const res = await fetch("/api/gerar-contrato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao gerar contrato");
      }

      const data = await res.json();
      setResultado(data.contrato);
      setGerado(true);
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    const blob = new Blob([resultado], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const tipoLabel = TIPOS_CONTRATO.find(t => t.value === form.tipo_contrato)?.label ?? "contrato";
    a.download = `${tipoLabel.toLowerCase().replace(/ /g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const tipoSelecionado = TIPOS_CONTRATO.find(t => t.value === form.tipo_contrato)?.label ?? "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm">
              <ArrowLeft className="w-4 h-4" /> Voltar
            </Link>
            <div className="flex items-center gap-2">
              <Scale className="text-green-700 w-5 h-5" />
              <span className="font-bold text-gray-900">AgroLegal</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Gerador de Contratos Rurais</span>
            {session?.user && (
              <>
                <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                  <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                </Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 gap-8">
          {/* Form */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-8">
                <FileText className="w-5 h-5 text-green-700" />
                <h1 className="text-xl font-bold text-gray-900">Dados do Contrato</h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Contrato *
                  </label>
                  <div className="relative">
                    <select
                      name="tipo_contrato"
                      value={form.tipo_contrato}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {TIPOS_CONTRATO.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Partes */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Partes</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Arrendador / Cedente *" name="arrendador_nome" value={form.arrendador_nome} onChange={handleChange} placeholder="Nome completo ou razão social" required />
                      <Field label="CPF / CNPJ *" name="arrendador_cpf_cnpj" value={form.arrendador_cpf_cnpj} onChange={handleChange} placeholder="000.000.000-00" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Arrendatário / Cessionário *" name="arrendatario_nome" value={form.arrendatario_nome} onChange={handleChange} placeholder="Nome completo ou razão social" required />
                      <Field label="CPF / CNPJ *" name="arrendatario_cpf_cnpj" value={form.arrendatario_cpf_cnpj} onChange={handleChange} placeholder="000.000.000-00" required />
                    </div>
                  </div>
                </div>

                {/* Imóvel */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Imóvel Rural</h3>
                  <div className="space-y-4">
                    <Field label="Nome / Denominação do Imóvel *" name="imovel_nome" value={form.imovel_nome} onChange={handleChange} placeholder="Ex: Fazenda Santa Maria" required />
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Município *" name="imovel_municipio" value={form.imovel_municipio} onChange={handleChange} placeholder="Cidade" required />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Estado *</label>
                        <div className="relative">
                          <select
                            name="imovel_estado"
                            value={form.imovel_estado}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            {ESTADOS_BR.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Área Total (hectares) *" name="imovel_area" value={form.imovel_area} onChange={handleChange} placeholder="Ex: 500,00" required />
                      <Field label="Nº Matrícula" name="imovel_matricula" value={form.imovel_matricula} onChange={handleChange} placeholder="Ex: 12.345" />
                    </div>
                    <Field label="Código CAR" name="imovel_car" value={form.imovel_car} onChange={handleChange} placeholder="Ex: MT-5100250-..." />
                  </div>
                </div>

                {/* Condições */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Condições do Contrato</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Prazo (anos) *" name="prazo_anos" value={form.prazo_anos} onChange={handleChange} placeholder="Ex: 5" required />
                      <Field label="Valor / Remuneração *" name="valor_arrendamento" value={form.valor_arrendamento} onChange={handleChange} placeholder="Ex: R$ 200/ha ou 15 sc/ha" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Forma de Pagamento *</label>
                      <div className="relative">
                        <select
                          name="forma_pagamento"
                          value={form.forma_pagamento}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="anual">Anual</option>
                          <option value="semestral">Semestral</option>
                          <option value="mensal">Mensal</option>
                          <option value="colheita">Na colheita</option>
                          <option value="producao">Em produção (sacas)</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Uso Destinado *</label>
                      <input
                        name="uso_destinado"
                        value={form.uso_destinado}
                        onChange={handleChange}
                        required
                        placeholder="Ex: Cultivo de soja e milho, pecuária extensiva..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Observações / Cláusulas Especiais</label>
                      <textarea
                        name="observacoes"
                        value={form.observacoes}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Inclua aqui qualquer condição especial que deseja no contrato..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                </div>

                {erro && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {erro}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Gerando contrato com IA...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Gerar Contrato
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Result */}
          <div>
            {!gerado && !loading && (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12">
                <FileText className="w-12 h-12 text-gray-200 mb-4" />
                <p className="text-gray-400 font-medium">Seu contrato aparecerá aqui</p>
                <p className="text-gray-300 text-sm mt-2">Preencha o formulário e clique em Gerar Contrato</p>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-2xl border border-gray-200 h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12">
                <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Gerando {tipoSelecionado}...</p>
                <p className="text-gray-400 text-sm mt-2">A IA está elaborando o contrato com base na legislação agrária brasileira</p>
              </div>
            )}

            {gerado && resultado && (
              <div className="bg-white rounded-2xl border border-gray-200 flex flex-col h-full">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <div>
                    <h2 className="font-bold text-gray-900">{tipoSelecionado}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Gerado com IA • Revise antes de usar</p>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Baixar
                  </button>
                </div>
                <div className="flex-1 overflow-auto p-6">
                  <pre className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-mono">
                    {resultado}
                  </pre>
                </div>
                <div className="px-6 py-3 bg-amber-50 border-t border-amber-100 rounded-b-2xl">
                  <p className="text-xs text-amber-700">
                    Este contrato foi gerado por IA com base nos dados fornecidos. Recomenda-se revisão por advogado especializado antes da assinatura.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    </div>
  );
}
