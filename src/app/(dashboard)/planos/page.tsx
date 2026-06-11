import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Check } from 'lucide-react'
import PaymentButton from './PaymentButton'

export const dynamic = 'force-dynamic'

export default async function PlanosPage() {
  const session = await getSession()
  if (!session) redirect('/entrar')

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { plan: true, planExpiresAt: true, monthlyResponses: true },
  })
  if (!user) redirect('/entrar')

  const isPro = user.plan === 'pro'

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Planos</h1>
        <p className="text-gray-500 mt-1">
          Plano atual: <span className={`font-semibold ${isPro ? 'text-indigo-600' : 'text-gray-700'}`}>
            {isPro ? 'Pro' : 'Gratuito'}
          </span>
          {isPro && user.planExpiresAt && (
            <span className="text-gray-500 ml-2">
              (válido até {new Date(user.planExpiresAt).toLocaleDateString('pt-BR')})
            </span>
          )}
        </p>
        {!isPro && (
          <p className="text-sm text-gray-500 mt-1">
            Respostas usadas este mês: <strong>{user.monthlyResponses}</strong> / 30
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
        {/* Free Plan */}
        <div className={`bg-white rounded-2xl p-8 border-2 ${!isPro ? 'border-indigo-500' : 'border-gray-200'}`}>
          {!isPro && (
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-2">Plano atual</div>
          )}
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
            ].map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          {!isPro ? (
            <div className="w-full text-center py-3 rounded-xl bg-gray-50 text-gray-400 text-sm font-medium">
              Plano atual
            </div>
          ) : null}
        </div>

        {/* Pro Plan */}
        <div className={`bg-white rounded-2xl p-8 border-2 ${isPro ? 'border-indigo-500' : 'border-gray-200'}`}>
          {isPro && (
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-2">Plano atual</div>
          )}
          <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900">R$15</span>
            <span className="text-gray-500">/mês</span>
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
            ].map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          {isPro ? (
            <div className="w-full text-center py-3 rounded-xl bg-indigo-50 text-indigo-600 text-sm font-medium">
              Plano atual ✓
            </div>
          ) : (
            <PaymentButton />
          )}
        </div>
      </div>
    </div>
  )
}
