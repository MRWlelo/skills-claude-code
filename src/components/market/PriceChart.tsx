import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { PricePoint } from '../../types/market'

interface Props {
  data: PricePoint[]
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-surface-3 p-3 text-xs shadow-xl">
      <p className="mb-1 text-zinc-400">
        {label ? format(new Date(label), 'dd MMM yyyy', { locale: ptBR }) : ''}
      </p>
      <p className="font-mono font-semibold text-primary">{payload[0].value}¢ SIM</p>
      <p className="text-zinc-500">{100 - payload[0].value}¢ NÃO</p>
    </div>
  )
}

export function PriceChart({ data }: Props) {
  const chartData = data.map((p) => ({ ts: p.ts, yes_price: p.yes_price }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#16c784" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#16c784" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2e2e33" vertical={false} />
        <XAxis
          dataKey="ts"
          tickFormatter={(v) => format(new Date(v), 'dd/MM', { locale: ptBR })}
          tick={{ fill: '#71717a', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: '#71717a', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}¢`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="yes_price"
          stroke="#16c784"
          strokeWidth={2}
          fill="url(#grad)"
          dot={false}
          activeDot={{ r: 4, fill: '#16c784', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
