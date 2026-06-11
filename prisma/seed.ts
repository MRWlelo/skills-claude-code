import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('demo123', 10)

  const user = await prisma.user.upsert({
    where: { email: 'demo@autogram.com.br' },
    update: {},
    create: {
      name: 'Maria Silva',
      email: 'demo@autogram.com.br',
      password: hash,
      plan: 'pro',
    },
  })

  // Delete existing Instagram account for this user to avoid duplicate
  await prisma.instagramAccount.deleteMany({ where: { userId: user.id } })

  await prisma.instagramAccount.create({
    data: {
      userId: user.id,
      instagramId: '123456789',
      username: 'mariasilva.moda',
      name: 'Maria Silva Moda',
      accessToken: 'mock_token',
      pageId: 'page_123',
    },
  })

  // Delete existing automations
  await prisma.automation.deleteMany({ where: { userId: user.id } })

  const auto1 = await prisma.automation.create({
    data: {
      userId: user.id,
      name: 'Resposta Automática - Comentários',
      description: 'Envia DM para quem comentar "quero" nos posts',
      status: 'active',
      triggerType: 'comment_keyword',
      triggerValue: 'quero',
      triggered: 127,
      messagesSent: 127,
      leads: 43,
      nodes: JSON.stringify([
        { id: 'trigger-1', type: 'trigger', position: { x: 250, y: 50 }, data: { label: 'Comentário com Palavra-chave', triggerType: 'comment_keyword', keyword: 'quero' } },
        { id: 'message-1', type: 'message', position: { x: 250, y: 200 }, data: { label: 'DM Automática', message: 'Oi! Vi que você se interessou 😊 Posso te enviar mais informações sobre o produto?' } },
        { id: 'delay-1', type: 'delay', position: { x: 250, y: 380 }, data: { label: 'Aguardar 24h', hours: 24 } },
        { id: 'message-2', type: 'message', position: { x: 250, y: 530 }, data: { label: 'Follow-up', message: 'Olá novamente! Não quero perder seu interesse 💕 Clique aqui para ver o catálogo: [link]' } },
      ]),
      edges: JSON.stringify([
        { id: 'e1', source: 'trigger-1', target: 'message-1', animated: true },
        { id: 'e2', source: 'message-1', target: 'delay-1', animated: true },
        { id: 'e3', source: 'delay-1', target: 'message-2', animated: true },
      ]),
    },
  })

  const auto2 = await prisma.automation.create({
    data: {
      userId: user.id,
      name: 'Boas-vindas Novos Seguidores',
      description: 'DM de boas-vindas automática para novos seguidores',
      status: 'active',
      triggerType: 'new_follower',
      triggered: 89,
      messagesSent: 89,
      leads: 21,
      nodes: JSON.stringify([
        { id: 'trigger-1', type: 'trigger', position: { x: 250, y: 50 }, data: { label: 'Novo Seguidor', triggerType: 'new_follower' } },
        { id: 'message-1', type: 'message', position: { x: 250, y: 200 }, data: { label: 'DM de Boas-vindas', message: 'Olá! Seja muito bem-vindo(a) ao meu perfil 🌟 Aqui compartilho dicas de moda e novidades exclusivas.' } },
        { id: 'tag-1', type: 'tag', position: { x: 250, y: 380 }, data: { label: 'Adicionar Tag', tag: 'novo-seguidor' } },
      ]),
      edges: JSON.stringify([
        { id: 'e1', source: 'trigger-1', target: 'message-1', animated: true },
        { id: 'e2', source: 'message-1', target: 'tag-1', animated: true },
      ]),
    },
  })

  const auto3 = await prisma.automation.create({
    data: {
      userId: user.id,
      name: 'Suporte IA 24/7',
      description: 'Atendimento com IA para dúvidas frequentes',
      status: 'inactive',
      triggerType: 'any_dm',
      triggered: 34,
      messagesSent: 68,
      leads: 12,
      nodes: JSON.stringify([
        { id: 'trigger-1', type: 'trigger', position: { x: 250, y: 50 }, data: { label: 'Qualquer DM', triggerType: 'any_dm' } },
        { id: 'ai-1', type: 'ai', position: { x: 250, y: 200 }, data: { label: 'Resposta IA', prompt: 'Você é um assistente de atendimento da loja Maria Silva Moda. Responda de forma simpática e profissional.' } },
      ]),
      edges: JSON.stringify([
        { id: 'e1', source: 'trigger-1', target: 'ai-1', animated: true },
      ]),
    },
  })

  // Delete existing contacts and conversations
  await prisma.message.deleteMany({ where: { conversation: { userId: user.id } } })
  await prisma.conversation.deleteMany({ where: { userId: user.id } })
  await prisma.contact.deleteMany({ where: { userId: user.id } })

  const contactNames = [
    { name: 'Ana Paula Souza', username: 'anapaula.s', tags: ['lead-quente', 'interesse-vestidos'], source: 'Resposta Automática - Comentários' },
    { name: 'Carla Mendes', username: 'carlamendes_', tags: ['cliente', 'vip'], source: 'Boas-vindas Novos Seguidores' },
    { name: 'Fernanda Lima', username: 'ferlima.insta', tags: ['lead-frio'], source: 'Resposta Automática - Comentários' },
    { name: 'Juliana Costa', username: 'ju.costa22', tags: ['cliente'], source: 'Boas-vindas Novos Seguidores' },
    { name: 'Mariana Oliveira', username: 'mari.oli', tags: ['lead-quente', 'follow-up'], source: 'Suporte IA 24/7' },
    { name: 'Patricia Santos', username: 'paty.santos', tags: ['cliente', 'recorrente'], source: 'Boas-vindas Novos Seguidores' },
    { name: 'Renata Ferreira', username: 'renata_moda', tags: ['lead-frio'], source: 'Resposta Automática - Comentários' },
    { name: 'Sabrina Rocha', username: 'sabrinaR', tags: ['lead-quente'], source: 'Resposta Automática - Comentários' },
    { name: 'Tatiana Alves', username: 'tati.alves_', tags: ['cliente'], source: 'Boas-vindas Novos Seguidores' },
    { name: 'Viviane Martins', username: 'viviM_moda', tags: ['lead-frio', 'interesse-acessórios'], source: 'Suporte IA 24/7' },
  ]

  const demoMessages = [
    ['Oi, quero saber mais sobre os produtos!', 'Olá! Que ótimo que você se interessou 😊 Posso te enviar nosso catálogo completo. Qual categoria te interessa mais?'],
    ['Quero ver o catálogo', 'Aqui está nosso catálogo completo: [link]. Temos vestidos, blusas e acessórios com ótimos preços!'],
    ['Quanto custa o frete?', 'O frete é calculado por CEP. Para compras acima de R$150, o frete é grátis para todo o Brasil! 📦'],
  ]

  for (const c of contactNames) {
    const contact = await prisma.contact.create({
      data: {
        userId: user.id,
        instagramId: `ig_${Math.random().toString(36).substr(2, 9)}`,
        username: c.username,
        name: c.name,
        isFollower: Math.random() > 0.3,
        tags: JSON.stringify(c.tags),
        source: c.source,
      },
    })

    const msgPair = demoMessages[Math.floor(Math.random() * demoMessages.length)]
    const conv = await prisma.conversation.create({
      data: {
        userId: user.id,
        contactId: contact.id,
        status: Math.random() > 0.4 ? 'open' : 'resolved',
        lastMessage: msgPair[1],
        lastMessageAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000),
        unreadCount: Math.floor(Math.random() * 4),
      },
    })

    await prisma.message.create({
      data: { conversationId: conv.id, content: msgPair[0], direction: 'inbound', status: 'read' }
    })
    await prisma.message.create({
      data: { conversationId: conv.id, content: msgPair[1], direction: 'outbound', status: 'delivered', automationId: auto1.id }
    })
  }

  console.log('Seed concluído!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
