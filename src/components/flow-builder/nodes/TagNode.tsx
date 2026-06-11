import { Handle, Position } from 'reactflow'
import { Tag } from 'lucide-react'

export default function TagNode({ data, selected }: { data: Record<string, unknown>; selected?: boolean }) {
  return (
    <div className={`bg-white rounded-2xl border-2 shadow-sm min-w-[180px] ${selected ? 'border-teal-500' : 'border-teal-300'}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-teal-500" />
      <div className="bg-teal-500 rounded-t-xl px-4 py-2 flex items-center gap-2">
        <Tag className="w-4 h-4 text-white" />
        <span className="text-white text-xs font-semibold uppercase tracking-wide">Tag</span>
      </div>
      <div className="px-4 py-3">
        <p className="text-sm font-medium text-gray-900">Adicionar Tag</p>
        {data.tag ? (
          <span className="inline-block mt-1 text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
            {String(data.tag)}
          </span>
        ) : null}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-teal-500" />
    </div>
  )
}
