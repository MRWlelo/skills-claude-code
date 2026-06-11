import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ContactsClient from './ContactsClient'

export const dynamic = 'force-dynamic'

export default async function ContatosPage() {
  const session = await getSession()
  if (!session) redirect('/entrar')

  const contacts = await prisma.contact.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Contatos</h1>
        <p className="text-gray-500 mt-1">{contacts.length} contato{contacts.length !== 1 ? 's' : ''} capturado{contacts.length !== 1 ? 's' : ''}</p>
      </div>
      <ContactsClient contacts={contacts} />
    </div>
  )
}
