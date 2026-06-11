import { Handle, Position } from 'reactflow'
import { MessageSquare } from 'lucide-react'

interface MessageNodeData {
  label: string
  message: string
}

export default function MessageNode({ data, selected }: { data: MessageNodeData; selected: boolean }) {
  return (
    <div className={`bg-white border-2 rounded-2xl p-4 min-w-[220px] max-w-[280px] shadow-sm transition-all ${
      selected ? 'border-blue-500 shadow-blue-100 shadow-lg' : 'border-blue-200'
    }`}>
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white" />
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <MessageSquare className="w-4 h-4 text-white" />
        </div>
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Message</span>
      </div>
      <p className="font-semibold text-gray-900 text-sm mb-1">{data.label}</p>
      {data.message && (
        <p className="text-xs text-gray-500 bg-blue-50 rounded-lg p-2 line-clamp-3">{data.message}</p>
      )}
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white" />
    </div>
  )
}
