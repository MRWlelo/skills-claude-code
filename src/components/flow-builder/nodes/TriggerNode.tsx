import { Handle, Position } from 'reactflow'
import { Hash, MessageSquare, Play, Users, Mail } from 'lucide-react'

const triggerIcons: Record<string, React.ElementType> = {
  comment_keyword: Hash,
  story_reply: Play,
  dm_keyword: MessageSquare,
  any_dm: Mail,
  new_follower: Users,
}

const triggerLabels: Record<string, string> = {
  comment_keyword: 'Comentário com Palavra-chave',
  story_reply: 'Resposta de Story',
  dm_keyword: 'DM com Palavra-chave',
  any_dm: 'Qualquer DM',
  new_follower: 'Novo Seguidor',
}

export default function TriggerNode({ data, selected }: { data: Record<string, unknown>; selected?: boolean }) {
  const triggerType = (data.triggerType as string) || 'comment_keyword'
  const Icon = triggerIcons[triggerType] || Hash

  return (
    <div className={`bg-white rounded-2xl border-2 shadow-sm min-w-[200px] ${selected ? 'border-green-500' : 'border-green-300'}`}>
      <div className="bg-green-500 rounded-t-xl px-4 py-2 flex items-center gap-2">
        <Icon className="w-4 h-4 text-white" />
        <span className="text-white text-xs font-semibold uppercase tracking-wide">Gatilho</span>
      </div>
      <div className="px-4 py-3">
        <p className="text-sm font-medium text-gray-900">{triggerLabels[triggerType] || String(data.label || 'Gatilho')}</p>
        {data.keyword ? (
          <p className="text-xs text-gray-500 mt-1">Palavra: <strong>{String(data.keyword)}</strong></p>
        ) : null}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-green-500" />
    </div>
  )
}
