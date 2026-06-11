import { Handle, Position } from 'reactflow'
import { Zap } from 'lucide-react'

interface TriggerNodeData {
  label: string
  trigger: string
  triggerValue?: string
}

export default function TriggerNode({ data, selected }: { data: TriggerNodeData; selected: boolean }) {
  return (
    <div className={`bg-white border-2 rounded-2xl p-4 min-w-[200px] shadow-sm transition-all ${
      selected ? 'border-emerald-500 shadow-emerald-100 shadow-lg' : 'border-emerald-200'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Trigger</span>
      </div>
      <p className="font-semibold text-gray-900 text-sm">{data.label}</p>
      {data.triggerValue && (
        <p className="text-xs text-gray-500 mt-1 font-mono bg-gray-50 px-2 py-1 rounded">
          "{data.triggerValue}"
        </p>
      )}
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-white" />
    </div>
  )
}
