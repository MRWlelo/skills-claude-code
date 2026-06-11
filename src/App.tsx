import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Header } from './components/layout/Header'
import { Home } from './pages/Home'
import { Markets } from './pages/Markets'
import { MarketDetail } from './pages/MarketDetail'
import { Portfolio } from './pages/Portfolio'
import { Learn } from './pages/Learn'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-surface text-zinc-300">
          <Header />
          <main className="pb-20 md:pb-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/mercados" element={<Markets />} />
              <Route path="/mercados/:ticker" element={<MarketDetail />} />
              <Route path="/carteira" element={<Portfolio />} />
              <Route path="/aprender" element={<Learn />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
