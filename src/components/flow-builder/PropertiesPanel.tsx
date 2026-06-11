'use client'

import { Node } from 'reactflow'
import { X } from 'lucide-react'

interface Props {
  node: Node
  onUpdate: (nodeId: string, data: any) => void
  onClose: () => void
}

export default function PropertiesPanel({ node, onUpdate, onClose }: Props) {
  function update(field: string, value: string) {
    onUpdate(node.id, { [field]: value })
  }

  return (
    <div className="w-72 bg-white border-l border-gray-200 flex-shrink-0 overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <p className="font-semibold text-gray-900 capitalize">{node.type} Properties</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
          <input
            value={node.data.label ?? ''}
            onChange={(e) => update('label', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {node.type === 'trigger' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Type</label>
              <select
                value={node.data.trigger ?? 'keyword'}
                onChange={(e) => update('trigger', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="keyword">Keyword</option>
                <option value="opt_in">Opt-in</option>
                <option value="button">Button Click</option>
                <option value="any">Any Message</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Keyword / Value</label>
              <input
                value={node.data.triggerValue ?? ''}
                onChange={(e) => update('triggerValue', e.target.value)}
                placeholder="e.g. hello, start, oi"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </>
        )}

        {node.type === 'message' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
            <textarea
              value={node.data.message ?? ''}
              onChange={(e) => update('message', e.target.value)}
              rows={4}
              placeholder="Type your message..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">Use {'{{name}}'} for contact name</p>
          </div>
        )}

        {node.type === 'condition' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <input
              value={node.data.condition ?? ''}
              onChange={(e) => update('condition', e.target.value)}
              placeholder='e.g. input contains "yes"'
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-400 mt-1">Top-left = Yes, Top-right = No</p>
          </div>
        )}

        {node.type === 'action' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
              <select
                value={node.data.action ?? 'add_tag'}
                onChange={(e) => update('action', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="add_tag">Add Tag</option>
                <option value="remove_tag">Remove Tag</option>
                <option value="assign_agent">Assign to Agent</option>
                <option value="send_to_flow">Send to Another Flow</option>
                <option value="unsubscribe">Unsubscribe</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
              <input
                value={node.data.value ?? ''}
                onChange={(e) => update('value', e.target.value)}
                placeholder="Enter value..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
