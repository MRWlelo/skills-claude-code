"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  Scale, FileText, Plus, LogOut, Download, Eye,
  Calendar, MapPin, User, ChevronRight, Loader2
} from "lucide-react";

interface Contrato {
  id: string;
  tipoLabel: string;
  arrendador: string;
  arrendatario: string;
  imovelNome: string;
  imovelMunicipio: string;
  imovelEstado: string;
  imovelArea: string;
  prazoAnos: string;
  valor: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(true);
  const [contratoAberto, setContratoAberto] = useState<string | null>(null);
  const [conteudo, setConteudo] = useState<string>("");
  const [loadingContrato, setLoadingContrato] = useState(false);

  useEffect(() => {
    fetch("/api/contratos")
      .then((r) => r.json())
      .then((data) => {
        setContratos(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  async function verContrato(id: string) {
    setLoadingContrato(true);
    setContratoAberto(id);
    const res = await fetch(`/api/contratos/${id}`);
    const data = await res.json();
    setConteudo(data.conteudo ?? "");
    setLoadingContrato(false);
  }

  function baixarContrato(contrato: Contrato) {
    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${contrato.tipoLabel.toLowerCase().replace(/ /g, "_")}_${contrato.imovelNome.toLowerCase().replace(/ /g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const userName = session?.user?.name ?? "Usuário";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Scale className="text-green-700 w-5 h-5" />
            <span className="font-bold text-gray-900">AgroLegal</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <NavItem icon={<FileText className="w-4 h-4" />} label="Meus contratos" active />
          <Link
            href="/app"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo contrato
          </Link>
        </nav>

        <div className="px-4 py-4 border-t border-gray-100">
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
            <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 w-full rounded-lg hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Meus Contratos</h1>
              <p className="text-gray-500 text-sm mt-1">
                {contratos.length} contrato{contratos.length !== 1 ? "s" : ""} gerado{contratos.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Link
              href="/app"
              className="flex items-center gap-2 bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo contrato
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
            </div>
          ) : contratos.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-200 rounded-2xl py-16 text-center">
              <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">Nenhum contrato gerado ainda</p>
              <Link
                href="/app"
                className="mt-4 inline-flex items-center gap-1 text-green-700 text-sm font-medium hover:underline"
              >
                Gerar primeiro contrato <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className={contratoAberto ? "grid grid-cols-2 gap-6" : "space-y-3"}>
              <div className="space-y-3">
                {contratos.map((c) => (
                  <div
                    key={c.id}
                    className={`bg-white border rounded-xl p-5 hover:border-green-200 transition-colors cursor-pointer ${
                      contratoAberto === c.id ? "border-green-400 ring-1 ring-green-200" : "border-gray-200"
                    }`}
                    onClick={() => verContrato(c.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">{c.tipoLabel}</p>
                        <p className="text-green-700 font-medium text-sm mt-0.5">{c.imovelNome}</p>
                      </div>
                      <span className="text-xs text-gray-400 ml-4 flex-shrink-0">
                        {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {c.arrendador} → {c.arrendatario}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {c.imovelMunicipio}/{c.imovelEstado}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {c.prazoAnos} anos • {c.imovelArea} ha
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {contratoAberto && (
                <div className="bg-white border border-gray-200 rounded-xl flex flex-col" style={{ maxHeight: "calc(100vh - 120px)", position: "sticky", top: "2rem" }}>
                  {loadingContrato ? (
                    <div className="flex items-center justify-center flex-1 py-20">
                      <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-green-700" />
                          <span className="text-sm font-semibold text-gray-900">
                            {contratos.find(c => c.id === contratoAberto)?.tipoLabel}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => baixarContrato(contratos.find(c => c.id === contratoAberto)!)}
                            className="flex items-center gap-1.5 text-xs text-green-700 border border-green-200 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <Download className="w-3 h-3" /> Baixar
                          </button>
                          <button
                            onClick={() => setContratoAberto(null)}
                            className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 overflow-auto p-5">
                        <pre className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-mono">
                          {conteudo}
                        </pre>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
        active ? "bg-green-50 text-green-700 font-medium" : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      {icon}
      {label}
    </div>
  );
}
