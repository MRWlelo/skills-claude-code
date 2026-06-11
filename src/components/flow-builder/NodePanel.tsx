import { Zap, MessageSquare, GitBranch, Settings2 } from 'lucide-react'

const nodeTypes = [
  {
    type: 'trigger',
    label: 'Trigger',
    description: 'Start the flow',
    icon: Zap,
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    iconBg: 'bg-emerald-500',
  },
  {
    type: 'message',
    label: 'Message',
    description: 'Send a message',
    icon: MessageSquare,
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    iconBg: 'bg-blue-500',
  },
  {
    type: 'condition',
    label: 'Condition',
    description: 'Branch on condition',
    icon: GitBranch,
    color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    iconBg: 'bg-yellow-400',
  },
  {
    type: 'action',
    label: 'Action',
    description: 'Perform an action',
    icon: Settings2,
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    iconBg: 'bg-purple-500',
  },
]

export default function NodePanel() {
  function onDragStart(event: React.DragEvent, nodeType: string) {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
      <div className="p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Drag to add
        </p>
        <div className="space-y-2">
          {nodeTypes.map(({ type, label, description, icon: Icon, color, iconBg }) => (
            <div
              key={type}
              draggable
              onDragStart={(e) => onDragStart(e, type)}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-grab active:cursor-grabbing ${color} transition-all hover:scale-[1.02] select-none`}
            >
              <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm leading-none">{label}</p>
                <p className="text-xs opacity-70 mt-0.5">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
