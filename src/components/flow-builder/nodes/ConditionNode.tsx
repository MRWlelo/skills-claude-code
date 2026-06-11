import { Handle, Position } from 'reactflow'
import { GitBranch } from 'lucide-react'

export default function ConditionNode({ data, selected }: { data: Record<string, unknown>; selected?: boolean }) {
  return (
    <div className={`bg-white rounded-2xl border-2 shadow-sm min-w-[200px] ${selected ? 'border-yellow-500' : 'border-yellow-300'}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-yellow-500" />
      <div className="bg-yellow-400 rounded-t-xl px-4 py-2 flex items-center gap-2">
        <GitBranch className="w-4 h-4 text-yellow-900" />
        <span className="text-yellow-900 text-xs font-semibold uppercase tracking-wide">Condição</span>
      </div>
      <div className="px-4 py-3">
        <p className="text-sm font-medium text-gray-900">{String(data.label || 'Condição')}</p>
        {data.condition ? (
          <p className="text-xs text-gray-500 mt-1">{String(data.condition)}</p>
        ) : null}
      </div>
      <div className="flex justify-between px-4 pb-3 text-xs text-gray-400">
        <span>Sim</span>
        <span>Não</span>
      </div>
      <Handle type="source" position={Position.Bottom} id="yes" style={{ left: '30%' }} className="w-3 h-3 !bg-green-500" />
      <Handle type="source" position={Position.Bottom} id="no" style={{ left: '70%' }} className="w-3 h-3 !bg-red-400" />
    </div>
  )
}
