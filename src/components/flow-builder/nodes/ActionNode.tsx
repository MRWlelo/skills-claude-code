import { Handle, Position } from 'reactflow'
import { Settings2 } from 'lucide-react'

interface ActionNodeData {
  label: string
  action: string
  value?: string
}

export default function ActionNode({ data, selected }: { data: ActionNodeData; selected: boolean }) {
  return (
    <div className={`bg-white border-2 rounded-2xl p-4 min-w-[200px] shadow-sm transition-all ${
      selected ? 'border-purple-500 shadow-purple-100 shadow-lg' : 'border-purple-200'
    }`}>
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white" />
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Settings2 className="w-4 h-4 text-white" />
        </div>
        <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Action</span>
      </div>
      <p className="font-semibold text-gray-900 text-sm mb-1">{data.label}</p>
      {data.action && (
        <p className="text-xs text-gray-500 bg-purple-50 px-2 py-1 rounded">{data.action}</p>
      )}
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white" />
    </div>
  )
}
