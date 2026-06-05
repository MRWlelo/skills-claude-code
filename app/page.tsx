import Link from "next/link";
import { FileText, Shield, Search, ChevronRight, CheckCircle, Scale, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="text-green-700 w-6 h-6" />
            <span className="font-bold text-xl text-gray-900">AgroLegal</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">Funcionalidades</a>
            <a href="#precos" className="text-sm text-gray-600 hover:text-gray-900">Preços</a>
            <Link
              href="/app"
              className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors"
            >
              Acessar plataforma
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <span className="bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full border border-green-200">
          Especializado em Direito Agrário
        </span>
        <h1 className="mt-6 text-5xl font-bold text-gray-900 leading-tight max-w-3xl mx-auto">
          Contratos rurais e compliance agrário com{" "}
          <span className="text-green-700">inteligência artificial</span>
        </h1>
        <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Gere minutas de contratos rurais, realize due diligence e analise riscos jurídicos
          de imóveis com a única IA especializada em direito agrário brasileiro.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/app"
            className="bg-green-700 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-green-800 transition-colors flex items-center gap-2"
          >
            Gerar contrato agora <ChevronRight className="w-4 h-4" />
          </Link>
          <a
            href="#features"
            className="text-gray-600 px-8 py-4 rounded-xl text-base font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Ver funcionalidades
          </a>
        </div>
        <p className="mt-4 text-sm text-gray-400">Sem cartão de crédito • Primeiro contrato grátis</p>
      </section>

      {/* Stats */}
      <section className="bg-green-700 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-3 gap-8 text-center text-white">
          <div>
            <p className="text-4xl font-bold">12</p>
            <p className="text-green-200 mt-1 text-sm">tipos de contratos rurais</p>
          </div>
          <div>
            <p className="text-4xl font-bold">40+</p>
            <p className="text-green-200 mt-1 text-sm">cláusulas especializadas</p>
          </div>
          <div>
            <p className="text-4xl font-bold">100%</p>
            <p className="text-green-200 mt-1 text-sm">direito agrário brasileiro</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Tudo que você precisa para o campo</h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            Desenvolvido por e para advogados agrários. Conhece a legislação, os costumes rurais e as peculiaridades do campo.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-8">
          <FeatureCard
            icon={<FileText className="w-6 h-6 text-green-700" />}
            title="Gerador de Contratos"
            description="Minutas completas de arrendamento rural, parceria agrícola, comodato, compra e venda de imóvel rural e muito mais. IA treinada na legislação agrária brasileira."
            items={["Arrendamento rural", "Parceria agrícola", "Comodato rural", "Compra e venda"]}
          />
          <FeatureCard
            icon={<Search className="w-6 h-6 text-green-700" />}
            title="Due Diligence Automatizada"
            description="Checklist completo para análise de imóveis rurais. Avalie documentação fundiária, situação no CAR, ITR, georreferenciamento e muito mais."
            items={["CAR / SICAR", "SIGEF / INCRA", "Cadeia dominial", "Reserva legal"]}
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6 text-green-700" />}
            title="Análise de Risco Jurídico"
            description="Identifique riscos antes que se tornem problemas. Análise de irregularidades fundiárias, sobreposições e pendências que impactam negócios rurais."
            items={["Irregularidades fundiárias", "Sobreposições", "Passivo ambiental", "Litígios pendentes"]}
          />
        </div>
      </section>

      {/* Contract types */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Contratos que geramos</h2>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[
              "Arrendamento Rural",
              "Parceria Agrícola",
              "Parceria Pecuária",
              "Comodato Rural",
              "Compra e Venda de Imóvel Rural",
              "Cessão de Uso",
              "Aforamento Rural",
              "Permuta de Imóveis Rurais",
              "Contrato de Integração",
              "Arrendamento com Opção de Compra",
              "Licença de Uso de Área",
              "Contrato de Meação",
            ].map((tipo) => (
              <div key={tipo} className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                {tipo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precos" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Preços simples e transparentes</h2>
        </div>
        <div className="grid grid-cols-3 gap-8">
          <PricingCard
            name="Avulso"
            price="R$49"
            unit="por contrato"
            description="Para quem usa ocasionalmente"
            features={["1 contrato por compra", "Download em PDF e DOCX", "Análise de risco básica", "Suporte por e-mail"]}
            cta="Gerar contrato"
            href="/app"
          />
          <PricingCard
            name="Escritório"
            price="R$499"
            unit="por mês"
            description="Para advogados e escritórios"
            features={["Contratos ilimitados", "Due diligence completa", "Análise de risco avançada", "Dashboard de clientes", "Suporte prioritário"]}
            cta="Começar grátis"
            href="/app"
            highlight
          />
          <PricingCard
            name="Enterprise"
            price="Sob consulta"
            unit=""
            description="Para cooperativas e bancos"
            features={["White-label disponível", "Integração via API", "SLA garantido", "Treinamento da equipe", "Conta gerenciada"]}
            cta="Falar com a equipe"
            href="/app"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-700 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center text-white">
          <MapPin className="w-10 h-10 mx-auto text-green-300 mb-6" />
          <h2 className="text-3xl font-bold">Pronto para modernizar seu escritório agrário?</h2>
          <p className="mt-4 text-green-200 text-lg">
            Gere seu primeiro contrato rural agora e veja a diferença na qualidade e velocidade do seu trabalho.
          </p>
          <Link
            href="/app"
            className="mt-8 inline-flex items-center gap-2 bg-white text-green-700 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-colors"
          >
            Começar agora — é grátis <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Scale className="w-4 h-4 text-green-700" />
          <span className="font-semibold text-gray-700">AgroLegal</span>
        </div>
        <p>Especializado em Direito Agrário Brasileiro • Não substitui assessoria jurídica profissional</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <div className="border border-gray-100 rounded-2xl p-8 hover:border-green-200 hover:shadow-sm transition-all">
      <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 text-lg mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-6">{description}</p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PricingCard({
  name,
  price,
  unit,
  description,
  features,
  cta,
  href,
  highlight = false,
}: {
  name: string;
  price: string;
  unit: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-8 border ${
        highlight ? "bg-green-700 border-green-700 text-white" : "border-gray-200 text-gray-900"
      }`}
    >
      {highlight && (
        <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full mb-4 inline-block">
          MAIS POPULAR
        </span>
      )}
      <p className={`font-semibold text-sm ${highlight ? "text-green-200" : "text-gray-500"}`}>{name}</p>
      <p className="text-4xl font-bold mt-2">{price}</p>
      {unit && <p className={`text-sm mt-1 ${highlight ? "text-green-200" : "text-gray-400"}`}>{unit}</p>}
      <p className={`text-sm mt-3 ${highlight ? "text-green-100" : "text-gray-500"}`}>{description}</p>
      <ul className="mt-6 space-y-3">
        {features.map((f) => (
          <li key={f} className={`flex items-start gap-2 text-sm ${highlight ? "text-green-100" : "text-gray-600"}`}>
            <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${highlight ? "text-green-300" : "text-green-600"}`} />
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`mt-8 block text-center py-3 rounded-xl font-semibold text-sm transition-colors ${
          highlight
            ? "bg-white text-green-700 hover:bg-green-50"
            : "border border-green-700 text-green-700 hover:bg-green-50"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}
