'use client'

import { useState, useCallback, useRef } from 'react'
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  NodeTypes,
} from 'reactflow'
import 'reactflow/dist/style.css'
import TriggerNode from './nodes/TriggerNode'
import MessageNode from './nodes/MessageNode'
import ConditionNode from './nodes/ConditionNode'
import ActionNode from './nodes/ActionNode'
import NodePanel from './NodePanel'
import PropertiesPanel from './PropertiesPanel'
import { Save, Play, Pause, ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  message: MessageNode,
  condition: ConditionNode,
  action: ActionNode,
}

interface FlowData {
  id: string
  name: string
  description: string | null
  status: string
  nodes: string
  edges: string
  trigger: string
  triggerValue: string | null
}

interface Props {
  flow: FlowData
}

let idCounter = 100

function getId() {
  return `node_${idCounter++}`
}

export default function FlowBuilder({ flow }: Props) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)

  const initialNodes = JSON.parse(flow.nodes || '[]')
  const initialEdges = JSON.parse(flow.edges || '[]')

  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialNodes.length > 0 ? initialNodes : [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 250, y: 50 },
        data: {
          label: 'Start',
          trigger: flow.trigger,
          triggerValue: flow.triggerValue,
        },
      },
    ]
  )
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [flowName, setFlowName] = useState(flow.name)
  const [status, setStatus] = useState(flow.status)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#6366f1' } }, eds)),
    [setEdges]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      if (!reactFlowWrapper.current || !reactFlowInstance) return

      const type = event.dataTransfer.getData('application/reactflow')
      if (!type) return

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const defaultData: Record<string, any> = {
        trigger: { label: 'Trigger', trigger: 'keyword', triggerValue: '' },
        message: { label: 'Send Message', message: 'Hello! How can I help you?' },
        condition: { label: 'Check Condition', condition: 'input contains "yes"' },
        action: { label: 'Take Action', action: 'add_tag', value: '' },
      }

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: defaultData[type] ?? { label: type },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, setNodes]
  )

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n))
    )
    setSelectedNode((prev) => prev?.id === nodeId ? { ...prev, data: { ...prev.data, ...newData } } : prev)
  }, [setNodes])

  async function save() {
    setSaving(true)
    try {
      await fetch(`/api/flows/${flow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: flowName,
          nodes: JSON.stringify(nodes),
          edges: JSON.stringify(edges),
          status,
        }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  async function toggleStatus() {
    const newStatus = status === 'active' ? 'inactive' : 'active'
    setStatus(newStatus)
    await fetch(`/api/flows/${flow.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
  }

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Top bar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            <Link href="/flows" className="text-gray-400 hover:text-gray-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <input
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              className="text-lg font-semibold text-gray-900 bg-transparent border-none outline-none focus:ring-0 min-w-0"
            />
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              status === 'active' ? 'bg-emerald-50 text-emerald-700' :
              status === 'inactive' ? 'bg-red-50 text-red-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {status}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleStatus}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                status === 'active'
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {status === 'active' ? 'Pause' : 'Activate'}
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Saved!' : saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Main area */}
        <div className="flex flex-1 overflow-hidden">
          <NodePanel />

          <div ref={reactFlowWrapper} className="flex-1">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              fitView
              defaultEdgeOptions={{ animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } }}
            >
              <Background color="#e5e7eb" gap={20} />
              <Controls className="!shadow-sm !border-gray-200 !rounded-xl overflow-hidden" />
              <MiniMap
                className="!shadow-sm !border-gray-200 !rounded-xl overflow-hidden"
                nodeColor={(n) => {
                  if (n.type === 'trigger') return '#10b981'
                  if (n.type === 'message') return '#3b82f6'
                  if (n.type === 'condition') return '#f59e0b'
                  return '#8b5cf6'
                }}
              />
            </ReactFlow>
          </div>

          {selectedNode && (
            <PropertiesPanel
              node={selectedNode}
              onUpdate={updateNodeData}
              onClose={() => setSelectedNode(null)}
            />
          )}
        </div>
      </div>
    </ReactFlowProvider>
  )
}
