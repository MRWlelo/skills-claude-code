import { Handle, Position } from 'reactflow'
import { MessageSquare } from 'lucide-react'

export default function MessageNode({ data, selected }: { data: Record<string, unknown>; selected?: boolean }) {
  const message = (data.message as string) || ''

  return (
    <div className={`bg-white rounded-2xl border-2 shadow-sm min-w-[200px] max-w-[280px] ${selected ? 'border-blue-500' : 'border-blue-300'}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-blue-500" />
      <div className="bg-blue-500 rounded-t-xl px-4 py-2 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-white" />
        <span className="text-white text-xs font-semibold uppercase tracking-wide">Mensagem</span>
      </div>
      <div className="px-4 py-3">
        <p className="text-sm font-medium text-gray-900 mb-1">{String(data.label || 'Enviar Mensagem')}</p>
        {message ? <p className="text-xs text-gray-500 line-clamp-2">{message}</p> : null}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-blue-500" />
    </div>
  )
}
