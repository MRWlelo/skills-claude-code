import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/utils'

const FAQ = [
  {
    q: 'O que são mercados de previsão?',
    a: 'Mercados de previsão são instrumentos financeiros onde contratos são negociados com base na probabilidade de eventos futuros acontecerem. O preço de um contrato reflete a estimativa coletiva dos participantes sobre a chance de um evento ocorrer.',
  },
  {
    q: 'Como funciona o mecanismo de precificação?',
    a: 'Cada contrato custa entre US$ 0,01 e US$ 0,99 (1¢ a 99¢). Se você compra um contrato SIM por 60¢ e o evento acontece, você recebe US$ 1,00 — lucro de 40¢. Se não acontece, perde os 60¢ investidos. O preço flutua com a oferta e demanda entre traders.',
  },
  {
    q: 'Qual a diferença entre Kalshi e casas de apostas tradicionais?',
    a: 'Enquanto casas de apostas (bets) operam com odds fixas definidas pela casa, a Kalshi funciona como uma bolsa de valores: os usuários negociam entre si e o preço é determinado pelo mercado. Isso aproxima os preços das probabilidades reais e elimina a margem da casa como contraparte.',
  },
  {
    q: 'Por que este app é legal no Brasil?',
    a: 'Esta plataforma é estritamente educacional e não envolve transações financeiras reais. É um simulador que usa dados reais para ensinar como mercados de derivativos funcionam. Nenhum valor real é apostado ou recebido.',
  },
  {
    q: 'O que é a Kalshi?',
    a: 'Fundada em 2018 pelos brasileiros Luana Lopes Lara e Tarek Mansour, a Kalshi é uma bolsa de derivativos de eventos regulamentada pela CFTC (Commodity Futures Trading Commission), a principal agência reguladora de futuros dos EUA.',
  },
  {
    q: 'O que é paper trading?',
    a: 'Paper trading é a prática de simular operações de trading sem dinheiro real. O nome vem da época em que traders anotavam operações em papel para aprender sem risco. Aqui você recebe R$ 10.000 virtuais para praticar.',
  },
  {
    q: 'Como o preço de um contrato reflete probabilidade?',
    a: 'Se um contrato SIM está cotado a 73¢, o mercado está estimando 73% de chance do evento acontecer. Ao longo do tempo, mercados de previsão bem estruturados tendem a ser mais precisos que pesquisas e modelos tradicionais — este fenômeno é chamado de "sabedoria das multidões".',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-white hover:text-primary"
      >
        {q}
        {open ? <ChevronUp className="h-4 w-4 shrink-0 text-zinc-400" /> : <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400" />}
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed text-zinc-400">{a}</p>
      )}
    </div>
  )
}

export function Learn() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-2 text-xl font-bold text-white">Central de Aprendizado</h1>
      <p className="mb-8 text-sm text-zinc-400">Entenda como mercados de previsão funcionam e como usar esta plataforma.</p>

      {/* How it works */}
      <section className="mb-8">
        <h2 className="mb-4 text-base font-semibold text-white">Como funciona</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              step: '1',
              title: 'Escolha um evento',
              desc: 'Navegue pelos mercados e encontre um evento sobre o qual você tem uma opinião.',
              color: 'bg-primary/10 text-primary',
            },
            {
              step: '2',
              title: 'Compre SIM ou NÃO',
              desc: 'Decida se o evento vai acontecer (SIM) ou não (NÃO) e compre contratos.',
              color: 'bg-blue-500/10 text-blue-400',
            },
            {
              step: '3',
              title: 'Receba R$ 1,00 se acertar',
              desc: 'Cada contrato vale exatamente R$ 1,00 se o evento se concretizar conforme sua aposta.',
              color: 'bg-purple-500/10 text-purple-400',
            },
          ].map(({ step, title, desc, color }) => (
            <div key={step} className="rounded-xl border border-border bg-surface-2 p-4">
              <div className={cn('mb-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold', color)}>
                {step}
              </div>
              <h3 className="mb-1 text-sm font-semibold text-white">{title}</h3>
              <p className="text-xs leading-relaxed text-zinc-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Example */}
      <section className="mb-8">
        <h2 className="mb-4 text-base font-semibold text-white">Exemplo prático</h2>
        <div className="rounded-xl border border-border bg-surface-2 p-5 space-y-3">
          <div className="rounded-lg bg-surface-3 p-3">
            <p className="text-sm font-medium text-white mb-1">
              📊 Mercado: "Taxa Selic acima de 13% em dezembro 2025?"
            </p>
            <p className="text-xs text-zinc-400">Preço atual: <strong className="text-primary">68¢</strong> (SIM) / <strong className="text-danger">32¢</strong> (NÃO)</p>
          </div>
          <div className="space-y-2 text-sm text-zinc-300">
            <p><strong className="text-white">Cenário A — Você acredita que SIM:</strong></p>
            <p className="text-zinc-400">Compra 100 contratos SIM por 68¢ cada = R$ 68 investidos.<br />
              Se a Selic ficar acima de 13%: recebe R$ 100 → lucro de R$ 32 (+47%).<br />
              Se a Selic cair abaixo: perde os R$ 68 investidos.</p>
          </div>
          <div className="space-y-2 text-sm text-zinc-300">
            <p><strong className="text-white">Cenário B — Você acredita que NÃO:</strong></p>
            <p className="text-zinc-400">Compra 100 contratos NÃO por 32¢ cada = R$ 32 investidos.<br />
              Se a Selic cair para 13% ou menos: recebe R$ 100 → lucro de R$ 68 (+212%).<br />
              Se a Selic continuar alta: perde os R$ 32 investidos.</p>
          </div>
        </div>
      </section>

      {/* Brasil context */}
      <section className="mb-8">
        <h2 className="mb-4 text-base font-semibold text-white">🇧🇷 Contexto brasileiro</h2>
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5 text-sm text-zinc-300 leading-relaxed">
          <p className="mb-3">
            A Kalshi está atualmente no centro de um debate jurídico no Brasil. Empresas de apostas esportivas
            (bets) pressionam o Ministério da Fazenda para <strong className="text-white">classificar a Kalshi como casa de apostas</strong>,
            o que exigiria licença operacional similar às bets regulamentadas em 2025.
          </p>
          <p className="mb-3">
            A distinção é importante: enquanto bets operam com o operador como contraparte e lucram quando
            o usuário perde, a Kalshi opera como <strong className="text-white">bolsa de valores regulada pela CFTC</strong>
            — os usuários negociam entre si.
          </p>
          <p>
            Neste simulador, você pode aprender os mecanismos sem risco legal — é apenas uma
            plataforma educacional de análise.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="mb-4 text-base font-semibold text-white">Perguntas frequentes</h2>
        <div className="rounded-xl border border-border bg-surface-2 px-4">
          {FAQ.map((item) => (
            <FaqItem key={item.q} {...item} />
          ))}
        </div>
      </section>
    </div>
  )
}
