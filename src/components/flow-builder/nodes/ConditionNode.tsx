import { Handle, Position } from 'reactflow'
import { GitBranch } from 'lucide-react'

interface ConditionNodeData {
  label: string
  condition: string
}

export default function ConditionNode({ data, selected }: { data: ConditionNodeData; selected: boolean }) {
  return (
    <div className={`bg-white border-2 rounded-2xl p-4 min-w-[200px] shadow-sm transition-all ${
      selected ? 'border-yellow-500 shadow-yellow-100 shadow-lg' : 'border-yellow-300'
    }`}>
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-yellow-500 !border-2 !border-white" />
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
          <GitBranch className="w-4 h-4 text-white" />
        </div>
        <span className="text-xs font-semibold text-yellow-600 uppercase tracking-wide">Condition</span>
      </div>
      <p className="font-semibold text-gray-900 text-sm mb-1">{data.label}</p>
      {data.condition && (
        <p className="text-xs text-gray-500 bg-yellow-50 px-2 py-1 rounded">{data.condition}</p>
      )}
      <div className="flex justify-between mt-3 text-xs text-gray-400">
        <span>Yes</span>
        <span>No</span>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="yes"
        style={{ left: '30%' }}
        className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="no"
        style={{ left: '70%' }}
        className="!w-3 !h-3 !bg-red-400 !border-2 !border-white"
      />
    </div>
  )
}
