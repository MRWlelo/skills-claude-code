import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('demo123', 10)

  const user = await prisma.user.upsert({
    where: { email: 'demo@conversabot.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@conversabot.com',
      password: hashedPassword,
    },
  })

  // Create channels
  await prisma.channel.createMany({
    data: [
      {
        name: 'WhatsApp Business',
        type: 'whatsapp',
        status: 'active',
        config: JSON.stringify({ phoneNumber: '+55 11 99999-0000', verified: true }),
        userId: user.id,
      },
      {
        name: 'Instagram',
        type: 'instagram',
        status: 'active',
        config: JSON.stringify({ username: '@conversabot', verified: true }),
        userId: user.id,
      },
      {
        name: 'Facebook Messenger',
        type: 'facebook',
        status: 'inactive',
        config: JSON.stringify({}),
        userId: user.id,
      },
      {
        name: 'Web Chat',
        type: 'webchat',
        status: 'active',
        config: JSON.stringify({ widgetColor: '#6366f1', welcomeMessage: 'Hello! How can I help you?' }),
        userId: user.id,
      },
    ],
    skipDuplicates: true,
  })

  // Create flows with proper nodes
  const triggerNode = {
    id: 'trigger-1',
    type: 'triggerNode',
    position: { x: 250, y: 50 },
    data: { label: 'Keyword Trigger', keyword: 'hello', description: 'Triggered when user sends "hello"' },
  }

  const messageNode1 = {
    id: 'message-1',
    type: 'messageNode',
    position: { x: 250, y: 200 },
    data: { label: 'Welcome Message', message: 'Hi! Welcome to our service. How can I help you today?' },
  }

  const conditionNode = {
    id: 'condition-1',
    type: 'conditionNode',
    position: { x: 250, y: 350 },
    data: { label: 'Check Response', condition: 'contains', value: 'support' },
  }

  const messageNode2 = {
    id: 'message-2',
    type: 'messageNode',
    position: { x: 100, y: 500 },
    data: { label: 'Support Message', message: 'Connecting you to our support team...' },
  }

  const actionNode = {
    id: 'action-1',
    type: 'actionNode',
    position: { x: 400, y: 500 },
    data: { label: 'Add Tag', action: 'addTag', value: 'interested' },
  }

  const edges = [
    { id: 'e1-2', source: 'trigger-1', target: 'message-1' },
    { id: 'e2-3', source: 'message-1', target: 'condition-1' },
    { id: 'e3-4', source: 'condition-1', target: 'message-2', sourceHandle: 'yes' },
    { id: 'e3-5', source: 'condition-1', target: 'action-1', sourceHandle: 'no' },
  ]

  await prisma.flow.createMany({
    data: [
      {
        name: 'Welcome Flow',
        description: 'Greets new users and routes them appropriately',
        status: 'active',
        nodes: JSON.stringify([triggerNode, messageNode1, conditionNode, messageNode2, actionNode]),
        edges: JSON.stringify(edges),
        trigger: 'keyword',
        triggerValue: 'hello',
        userId: user.id,
      },
      {
        name: 'Lead Capture',
        description: 'Captures lead information from new contacts',
        status: 'active',
        nodes: JSON.stringify([
          { id: 't1', type: 'triggerNode', position: { x: 250, y: 50 }, data: { label: 'Opt-in Trigger', keyword: 'start' } },
          { id: 'm1', type: 'messageNode', position: { x: 250, y: 200 }, data: { label: 'Ask Name', message: "What's your name?" } },
          { id: 'a1', type: 'actionNode', position: { x: 250, y: 350 }, data: { label: 'Save Contact', action: 'saveContact', value: 'name' } },
        ]),
        edges: JSON.stringify([
          { id: 'e1', source: 't1', target: 'm1' },
          { id: 'e2', source: 'm1', target: 'a1' },
        ]),
        trigger: 'keyword',
        triggerValue: 'start',
        userId: user.id,
      },
      {
        name: 'Support Bot',
        description: 'Handles common support questions automatically',
        status: 'draft',
        nodes: JSON.stringify([
          { id: 't1', type: 'triggerNode', position: { x: 250, y: 50 }, data: { label: 'Support Trigger', keyword: 'help' } },
          { id: 'm1', type: 'messageNode', position: { x: 250, y: 200 }, data: { label: 'FAQ Menu', message: 'How can I help? Reply: 1-Hours, 2-Pricing, 3-Contact' } },
        ]),
        edges: JSON.stringify([
          { id: 'e1', source: 't1', target: 'm1' },
        ]),
        trigger: 'keyword',
        triggerValue: 'help',
        userId: user.id,
      },
    ],
  })

  // Create contacts
  const contactData = [
    { name: 'Ana Silva', phone: '+55 11 98765-4321', channel: 'whatsapp', tags: JSON.stringify(['lead', 'hot']) },
    { name: 'Carlos Santos', phone: '+55 11 91234-5678', channel: 'whatsapp', tags: JSON.stringify(['customer']) },
    { name: 'Maria Oliveira', email: 'maria@example.com', channel: 'webchat', tags: JSON.stringify(['lead']) },
    { name: 'João Costa', phone: '+55 21 99876-5432', channel: 'instagram', tags: JSON.stringify(['follower']) },
    { name: 'Fernanda Lima', phone: '+55 31 98888-1111', channel: 'whatsapp', tags: JSON.stringify(['customer', 'vip']) },
    { name: 'Roberto Alves', email: 'roberto@example.com', channel: 'facebook', tags: JSON.stringify([]) },
    { name: 'Juliana Ferreira', phone: '+55 11 97777-2222', channel: 'whatsapp', tags: JSON.stringify(['lead']) },
    { name: 'Paulo Mendes', phone: '+55 41 96666-3333', channel: 'instagram', tags: JSON.stringify(['customer']) },
    { name: 'Camila Rocha', email: 'camila@example.com', channel: 'webchat', tags: JSON.stringify(['new']) },
    { name: 'Diego Martins', phone: '+55 11 95555-4444', channel: 'whatsapp', tags: JSON.stringify(['lead', 'cold']) },
  ]

  for (const contact of contactData) {
    const created = await prisma.contact.create({
      data: { ...contact, userId: user.id },
    })

    // Create a conversation for each contact
    const conversation = await prisma.conversation.create({
      data: {
        contactId: created.id,
        channel: contact.channel,
        status: Math.random() > 0.5 ? 'open' : 'resolved',
        lastMessage: 'Last message preview...',
        lastMessageAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        unreadCount: Math.floor(Math.random() * 5),
      },
    })

    // Create messages
    await prisma.message.createMany({
      data: [
        {
          conversationId: conversation.id,
          content: 'Hello, I need help with my order.',
          direction: 'inbound',
          status: 'read',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          conversationId: conversation.id,
          content: 'Hi! I would be happy to help you. What seems to be the issue?',
          direction: 'outbound',
          status: 'read',
          createdAt: new Date(Date.now() - 1.9 * 60 * 60 * 1000),
        },
        {
          conversationId: conversation.id,
          content: 'Last message preview...',
          direction: 'inbound',
          status: 'delivered',
          createdAt: new Date(Date.now() - 30 * 60 * 1000),
        },
      ],
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
