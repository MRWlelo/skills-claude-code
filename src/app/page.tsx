import Link from 'next/link'
import { MessageSquare, Hash, Play, Sparkles, Clock, Users, Zap, Check } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">AutoGram</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#funcionalidades" className="text-gray-600 hover:text-gray-900 text-sm">Funcionalidades</a>
              <a href="#precos" className="text-gray-600 hover:text-gray-900 text-sm">Preços</a>
              <Link href="/entrar" className="text-gray-600 hover:text-gray-900 text-sm">Entrar</Link>
              <Link href="/cadastrar" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                Começar grátis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-700/50 rounded-full px-4 py-1.5 text-sm text-indigo-200 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                API Oficial do Instagram • Aprovado pela Meta
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                Transforme seguidores em clientes no{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">
                  piloto automático
                </span>
              </h1>
              <p className="text-xl text-indigo-200 mb-8 leading-relaxed">
                Automatize DMs, comentários e stories no Instagram. Capture leads, envie mensagens personalizadas e veja suas vendas crescerem sem esforço.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/cadastrar" className="bg-white text-indigo-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-colors text-center">
                  Começar grátis
                </Link>
                <a href="#funcionalidades" className="border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors text-center">
                  Ver como funciona
                </a>
              </div>
              <p className="text-sm text-indigo-300 mt-4">Sem cartão de crédito • Plano gratuito disponível</p>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-72 bg-white rounded-3xl shadow-2xl p-4 transform rotate-2">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">M</div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">mariasilva.moda</p>
                        <p className="text-xs text-gray-500">Instagram DM</p>
                      </div>
                      <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Auto</span>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-gray-200 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-gray-700 max-w-[200px]">
                        Oi! quero saber mais 😍
                      </div>
                      <div className="bg-indigo-600 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-white ml-auto max-w-[220px]">
                        Olá! Que ótimo! 🎉 Aqui está nosso catálogo completo: [link]
                      </div>
                      <div className="bg-gray-200 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-gray-700 max-w-[200px]">
                        Obrigada! Vou ver 💕
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 px-2">
                    <span className="text-xs text-gray-400">⚡ Respondido automaticamente</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-green-500 text-white rounded-xl px-3 py-1.5 text-xs font-semibold shadow-lg">
                  +43 leads hoje
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-indigo-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold">500+</p>
              <p className="text-indigo-200 text-sm">usuários ativos</p>
            </div>
            <div>
              <p className="text-2xl font-bold">2M+</p>
              <p className="text-indigo-200 text-sm">mensagens enviadas</p>
            </div>
            <div>
              <p className="text-2xl font-bold">API Oficial</p>
              <p className="text-indigo-200 text-sm">Meta / Instagram</p>
            </div>
            <div>
              <p className="text-2xl font-bold">Suporte</p>
              <p className="text-indigo-200 text-sm">100% em PT-BR</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="funcionalidades" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa para crescer no Instagram
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Automatize interações, capture leads e venda mais sem ficar preso ao celular
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MessageSquare,
                title: 'Automação de DM',
                description: 'Envie mensagens automaticamente para quem interagir com seus posts ou comentários no Instagram',
                color: 'bg-blue-100 text-blue-600',
              },
              {
                icon: Hash,
                title: 'Gatilho por Comentário',
                description: 'Dispare DMs automaticamente quando alguém comentar uma palavra-chave específica no seu post',
                color: 'bg-purple-100 text-purple-600',
              },
              {
                icon: Play,
                title: 'Resposta de Stories',
                description: 'Automatize respostas para quem interagir com seus stories e capture leads instantaneamente',
                color: 'bg-pink-100 text-pink-600',
              },
              {
                icon: Sparkles,
                title: 'IA no Atendimento',
                description: 'Fluxos inteligentes com IA para capturar e nutrir leads 24 horas por dia, 7 dias por semana',
                color: 'bg-indigo-100 text-indigo-600',
              },
              {
                icon: Clock,
                title: 'Lembretes Automáticos',
                description: 'Agende follow-ups automáticos para aumentar a conversão e não deixar nenhum lead esfriar',
                color: 'bg-orange-100 text-orange-600',
              },
              {
                icon: Users,
                title: 'CRM Integrado',
                description: 'Gerencie todos os seus leads e contatos em um só lugar com tags, histórico e anotações',
                color: 'bg-green-100 text-green-600',
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Como funciona</h2>
            <p className="text-xl text-gray-500">Comece a automatizar em minutos</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Conecte seu Instagram',
                description: 'Conecte sua conta do Instagram em segundos usando a API oficial da Meta. Seguro e aprovado.',
              },
              {
                step: '2',
                title: 'Crie sua automação',
                description: 'Use nosso construtor visual de fluxos para criar automações personalizadas sem precisar programar.',
              },
              {
                step: '3',
                title: 'Veja os resultados',
                description: 'Acompanhe em tempo real quantos leads foram capturados e mensagens enviadas automaticamente.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precos" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Planos simples e transparentes</h2>
            <p className="text-xl text-gray-500">Comece grátis e faça upgrade quando precisar</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Gratuito</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">R$0</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  '30 respostas automáticas/mês',
                  '1 automação ativa',
                  'Instagram + Facebook',
                  'Caixa de entrada básica',
                  'Suporte por email',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-gray-600">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/cadastrar" className="block w-full text-center border border-indigo-600 text-indigo-600 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors">
                Começar grátis
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                MAIS POPULAR
              </div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">R$15</span>
                <span className="text-indigo-200">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Tudo do plano gratuito',
                  'Respostas ilimitadas',
                  'Automações ilimitadas',
                  'IA nos fluxos de atendimento',
                  'Lembretes automáticos',
                  'Stories e comentários',
                  'Suporte prioritário',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-indigo-100">
                    <Check className="w-5 h-5 text-white flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/cadastrar" className="block w-full text-center bg-white text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
                Assinar por R$15/mês
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">AutoGram</span>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Suporte</a>
            </div>
            <p className="text-sm">Feito no Brasil 🇧🇷 © 2024 AutoGram</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
