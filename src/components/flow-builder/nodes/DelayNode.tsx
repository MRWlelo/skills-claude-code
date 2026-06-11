import { Handle, Position } from 'reactflow'
import { Clock } from 'lucide-react'

export default function DelayNode({ data, selected }: { data: Record<string, unknown>; selected?: boolean }) {
  const hours = data.hours as number | undefined
  const days = data.days as number | undefined

  let timeLabel = 'Aguardar...'
  if (hours) timeLabel = `Aguardar ${hours}h`
  else if (days) timeLabel = `Aguardar ${days} dia${days !== 1 ? 's' : ''}`

  return (
    <div className={`bg-white rounded-2xl border-2 shadow-sm min-w-[180px] ${selected ? 'border-orange-500' : 'border-orange-300'}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-orange-500" />
      <div className="bg-orange-500 rounded-t-xl px-4 py-2 flex items-center gap-2">
        <Clock className="w-4 h-4 text-white" />
        <span className="text-white text-xs font-semibold uppercase tracking-wide">Aguardar</span>
      </div>
      <div className="px-4 py-3">
        <p className="text-sm font-medium text-gray-900">{timeLabel}</p>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-orange-500" />
    </div>
  )
}
