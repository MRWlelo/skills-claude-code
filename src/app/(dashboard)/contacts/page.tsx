import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ContactsClient from './ContactsClient'

export default async function ContactsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const contacts = await prisma.contact.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { conversations: true } } },
  })

  return <ContactsClient initialContacts={contacts} />
}
