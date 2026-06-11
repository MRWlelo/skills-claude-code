import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/layout/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect('/entrar')

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, email: true, plan: true },
  })

  if (!user) redirect('/entrar')

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
