import { Handle, Position } from 'reactflow'
import { Sparkles, Lock } from 'lucide-react'

export default function AINode({ data, selected }: { data: Record<string, unknown>; selected?: boolean }) {
  const isLocked = data.isLocked as boolean | undefined

  return (
    <div className={`bg-white rounded-2xl border-2 shadow-sm min-w-[200px] ${selected ? 'border-purple-500' : 'border-purple-300'}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-purple-500" />
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-t-xl px-4 py-2 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-white" />
        <span className="text-white text-xs font-semibold uppercase tracking-wide">IA</span>
        {isLocked && <Lock className="w-3.5 h-3.5 text-white/80 ml-auto" />}
      </div>
      <div className="px-4 py-3">
        <p className="text-sm font-medium text-gray-900">{String(data.label || 'Resposta com IA')}</p>
        {isLocked ? (
          <p className="text-xs text-purple-600 mt-1 font-medium">Disponível no plano Pro</p>
        ) : (
          data.prompt ? <p className="text-xs text-gray-500 line-clamp-2 mt-1">{String(data.prompt)}</p> : null
        )}
      </div>
      {!isLocked && <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-purple-500" />}
    </div>
  )
}
