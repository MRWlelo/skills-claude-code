'use client'

import { useState, useCallback, useRef } from 'react'
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  type Connection,
  type Edge,
  type Node,
  type ReactFlowInstance,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Zap, MessageSquare, Clock, Sparkles, Tag, GitBranch } from 'lucide-react'
import TriggerNode from './nodes/TriggerNode'
import MessageNode from './nodes/MessageNode'
import DelayNode from './nodes/DelayNode'
import AINode from './nodes/AINode'
import TagNode from './nodes/TagNode'
import ConditionNode from './nodes/ConditionNode'

const nodeTypes = {
  trigger: TriggerNode,
  message: MessageNode,
  delay: DelayNode,
  ai: AINode,
  tag: TagNode,
  condition: ConditionNode,
}

interface AutomationData {
  id: string
  name: string
  status: string
  triggerType: string
  nodes: string
  edges: string
}

interface AutomationBuilderProps {
  automation: AutomationData
  userPlan: string
}

const nodeTypesList = [
  { type: 'trigger', label: 'Gatilho', description: 'Inicia o fluxo', icon: Zap, color: 'bg-green-100 text-green-600' },
  { type: 'message', label: 'Mensagem', description: 'Envia uma DM', icon: MessageSquare, color: 'bg-blue-100 text-blue-600' },
  { type: 'delay', label: 'Aguardar', description: 'Pausa antes do próximo passo', icon: Clock, color: 'bg-orange-100 text-orange-600' },
  { type: 'ai', label: 'IA', description: 'Resposta com inteligência artificial', icon: Sparkles, color: 'bg-purple-100 text-purple-600', proOnly: true },
  { type: 'tag', label: 'Adicionar Tag', description: 'Marca o contato', icon: Tag, color: 'bg-teal-100 text-teal-600' },
  { type: 'condition', label: 'Condição', description: 'Ramificação se/senão', icon: GitBranch, color: 'bg-yellow-100 text-yellow-600' },
]

const triggerOptions = [
  { value: 'comment_keyword', label: 'Comentário com Palavra-chave' },
  { value: 'story_reply', label: 'Resposta de Story' },
  { value: 'dm_keyword', label: 'DM com Palavra-chave' },
  { value: 'any_dm', label: 'Qualquer DM' },
  { value: 'new_follower', label: 'Novo Seguidor' },
]

function AutomationBuilderInner({ automation, userPlan }: AutomationBuilderProps) {
  const router = useRouter()
  const [name, setName] = useState(automation.name)
  const [status, setStatus] = useState(automation.status)
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  const parsedNodes: Node[] = (() => {
    try {
      const n = JSON.parse(automation.nodes)
      if (userPlan === 'free') {
        return n.map((node: Node) =>
          node.type === 'ai' ? { ...node, data: { ...node.data, isLocked: true } } : node
        )
      }
      return n
    } catch { return [] }
  })()

  const parsedEdges: Edge[] = (() => {
    try { return JSON.parse(automation.edges) } catch { return [] }
  })()

  const [nodes, setNodes, onNodesChange] = useNodesState(parsedNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(parsedEdges)
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  )

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      const type = event.dataTransfer.getData('application/reactflow')
      if (!type || !rfInstance) return

      // Lock AI node for free users
      if (type === 'ai' && userPlan === 'free') {
        alert('O nó de IA está disponível apenas no plano Pro. Faça upgrade em Planos.')
        return
      }

      const position = rfInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: nodeTypesList.find(n => n.type === type)?.label || type },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [rfInstance, setNodes, userPlan]
  )

  const updateNodeData = useCallback((nodeId: string, newData: Record<string, unknown>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n))
    )
    setSelectedNode((prev) =>
      prev && prev.id === nodeId ? { ...prev, data: { ...prev.data, ...newData } } : prev
    )
  }, [setNodes])

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/automacoes/${automation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, status, nodes, edges }),
      })
      if (res.ok) {
        setSavedMsg('Salvo!')
        setTimeout(() => setSavedMsg(''), 2000)
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleStatus() {
    const res = await fetch(`/api/automacoes/${automation.id}/toggle`, { method: 'POST' })
    if (res.ok) {
      const updated = await res.json()
      setStatus(updated.status)
    } else {
      const data = await res.json()
      alert(data.error)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-4 z-10">
        <button
          onClick={() => router.push('/automacoes')}
          className="p-2 rounded-lg hover:bg-gray-50 text-gray-500"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-sm font-semibold text-gray-900 bg-transparent border-0 outline-none focus:ring-1 focus:ring-indigo-200 rounded px-2 py-1 min-w-[200px]"
        />
        <div className="flex items-center gap-2 ml-auto">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {status === 'active' ? 'Ativa' : 'Inativa'}
          </span>
          <button
            onClick={handleToggleStatus}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${status === 'active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
          >
            {status === 'active' ? 'Desativar' : 'Ativar'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Salvando...' : savedMsg || 'Salvar'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="w-52 bg-white border-r border-gray-100 flex flex-col overflow-y-auto">
          <div className="p-3 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Blocos</p>
          </div>
          <div className="p-2 space-y-1">
            {nodeTypesList.map((item) => (
              <div
                key={item.type}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/reactflow', item.type)
                  e.dataTransfer.effectAllowed = 'move'
                }}
                className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-grab hover:bg-gray-50 active:cursor-grabbing border border-transparent hover:border-gray-200 transition-colors"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <item.icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-medium text-gray-900">{item.label}</p>
                    {item.proOnly && userPlan === 'free' && (
                      <span className="text-[10px] bg-purple-100 text-purple-600 px-1 rounded font-semibold">Pro</span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 truncate">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setRfInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-50"
          >
            <Controls />
            <Background color="#e5e7eb" gap={16} />
          </ReactFlow>
        </div>

        {/* Right panel */}
        {selectedNode && (
          <div className="w-72 bg-white border-l border-gray-100 overflow-y-auto">
            <div className="p-4 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900">Propriedades</p>
              <p className="text-xs text-gray-500 mt-0.5">Nó: {selectedNode.type}</p>
            </div>
            <div className="p-4 space-y-4">
              {/* Label */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Rótulo</label>
                <input
                  value={String(selectedNode.data.label || '')}
                  onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                />
              </div>

              {/* Trigger-specific */}
              {selectedNode.type === 'trigger' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de Gatilho</label>
                    <select
                      value={String(selectedNode.data.triggerType || 'comment_keyword')}
                      onChange={(e) => updateNodeData(selectedNode.id, { triggerType: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                    >
                      {triggerOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  {(selectedNode.data.triggerType === 'comment_keyword' || selectedNode.data.triggerType === 'dm_keyword') && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Palavra-chave</label>
                      <input
                        value={String(selectedNode.data.keyword || '')}
                        onChange={(e) => updateNodeData(selectedNode.id, { keyword: e.target.value })}
                        placeholder="ex: quero, preço, info"
                        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                      />
                    </div>
                  )}
                </>
              )}

              {/* Message-specific */}
              {selectedNode.type === 'message' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Mensagem</label>
                  <textarea
                    value={String(selectedNode.data.message || '')}
                    onChange={(e) => updateNodeData(selectedNode.id, { message: e.target.value })}
                    rows={5}
                    placeholder="Digite a mensagem que será enviada automaticamente..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm resize-none"
                  />
                </div>
              )}

              {/* Delay-specific */}
              {selectedNode.type === 'delay' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Aguardar (horas)</label>
                  <input
                    type="number"
                    value={Number(selectedNode.data.hours || 1)}
                    onChange={(e) => updateNodeData(selectedNode.id, { hours: Number(e.target.value) })}
                    min={1}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                  />
                </div>
              )}

              {/* AI-specific */}
              {selectedNode.type === 'ai' && (
                userPlan === 'free' ? (
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-purple-700 font-medium mb-2">Recurso Pro</p>
                    <p className="text-xs text-purple-600 mb-3">O nó de IA está disponível apenas no plano Pro.</p>
                    <a href="/planos" className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg font-medium">
                      Fazer upgrade
                    </a>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Prompt da IA</label>
                    <textarea
                      value={String(selectedNode.data.prompt || '')}
                      onChange={(e) => updateNodeData(selectedNode.id, { prompt: e.target.value })}
                      rows={6}
                      placeholder="Descreva como a IA deve responder..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm resize-none"
                    />
                  </div>
                )
              )}

              {/* Tag-specific */}
              {selectedNode.type === 'tag' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tag</label>
                  <input
                    value={String(selectedNode.data.tag || '')}
                    onChange={(e) => updateNodeData(selectedNode.id, { tag: e.target.value })}
                    placeholder="ex: lead-quente"
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                  />
                </div>
              )}

              {/* Condition-specific */}
              {selectedNode.type === 'condition' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Condição</label>
                  <input
                    value={String(selectedNode.data.condition || '')}
                    onChange={(e) => updateNodeData(selectedNode.id, { condition: e.target.value })}
                    placeholder="ex: respondeu SIM"
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                  />
                </div>
              )}

              {/* Delete node */}
              <button
                onClick={() => {
                  setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id))
                  setSelectedNode(null)
                }}
                className="w-full text-xs text-red-500 hover:text-red-700 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                Remover nó
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AutomationBuilder(props: AutomationBuilderProps) {
  return (
    <ReactFlowProvider>
      <AutomationBuilderInner {...props} />
    </ReactFlowProvider>
  )
}
