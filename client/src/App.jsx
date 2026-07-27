import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const SUGGESTED_TOPICS = [
  'Sharax algorithm-ka Binary Search',
  'Waa maxay OOP (Object-Oriented Programming)?',
  'Kala sooc TCP iyo UDP',
  'Sida loo xisaabiyo Big-O notation',
  'Sharax normalization database-ka',
]

function KaniMark({ size = 32 }) {
  return (
    <div
      className="rounded-xl bg-gradient-to-br from-[var(--color-teal)] to-[var(--color-teal-dim)] flex items-center justify-center font-display font-bold text-[var(--color-ink)] shrink-0 card-shadow"
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      K
    </div>
  )
}

function UserMark({ size = 32 }) {
  return (
    <div
      className="rounded-xl bg-white/10 border border-white/10 flex items-center justify-center font-display font-semibold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      A
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-1.5 px-4 py-3.5">
      <span className="w-2 h-2 rounded-full bg-[var(--color-gold)] typing-dot" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 rounded-full bg-[var(--color-gold)] typing-dot" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 rounded-full bg-[var(--color-gold)] typing-dot" style={{ animationDelay: '300ms' }} />
    </div>
  )
}

function EmptyState({ onPick }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6">
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-2xl bg-[var(--color-teal)]/30 blur-xl glow-pulse" />
        <div className="relative">
          <KaniMark size={56} />
        </div>
      </div>
      <h1 className="font-display text-2xl md:text-3xl font-semibold mb-2">
        Salaan, waxaan ahay Kani Study
      </h1>
      <p className="text-[var(--color-mist)] max-w-md mb-8 leading-relaxed">
        Caawiyahaaga waxbarasho ee af-Soomaaliga ah. I weydii su'aal ku saabsan CS, math,
        ama mowduuc kasta oo aad barato.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg">
        {SUGGESTED_TOPICS.map((topic) => (
          <button
            key={topic}
            onClick={() => onPick(topic)}
            className="text-left text-sm px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-[var(--color-teal)]/30 transition-all text-[var(--color-paper)]/90"
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  )
}

const API_BASE = import.meta.env.VITE_API_URL || ''

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text) {
    const content = text ?? input
    if (!content.trim() || loading) return

    const nextMessages = [...messages, { role: 'user', content }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Khalad ayaa dhacay')
      setMessages([...nextMessages, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setMessages([...nextMessages, { role: 'assistant', content: `Waan ka xunnahay, khalad baa dhacay: ${err.message}. Fadlan hubi in server-ka uu shaqaynayo.` }])
    } finally {
      setLoading(false)
    }
  }

  const hasMessages = messages.length > 0

  return (
    <div className="h-full flex bg-[var(--color-ink)]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-r border-[var(--color-border)] bg-[var(--color-slate)]/60 backdrop-blur p-6">
        <div className="flex items-center gap-2.5 mb-10">
          <KaniMark size={34} />
          <div>
            <div className="font-display text-lg font-semibold tracking-tight leading-tight">Kani Study</div>
            <div className="text-xs text-[var(--color-mist)]">AI Study Assistant</div>
          </div>
        </div>

        <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-mist)] mb-3">Su'aalo soo jeediyay</p>
        <div className="flex flex-col gap-2">
          {SUGGESTED_TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => sendMessage(topic)}
              className="text-left text-sm px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.07] hover:border-[var(--color-teal)]/30 transition-all text-[var(--color-paper)]/85"
            >
              {topic}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-[var(--color-border)] flex items-center gap-2 text-xs text-[var(--color-mist)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-teal)]" />
          Powered by Abdikani — bilaash oo dhaqso ah
        </div>
      </aside>

      {/* Main chat */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between gap-2 px-4 md:px-8 py-4 border-b border-[var(--color-border)]">
          <div className="flex md:hidden items-center gap-2">
            <KaniMark size={28} />
            <span className="font-display font-semibold">Kani Study</span>
          </div>
          <div className="hidden md:block font-display font-medium text-[var(--color-paper)]/90">
            Fasal-ka Waxbarasho
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-mist)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Online
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 md:px-10 py-6">
          {!hasMessages ? (
            <EmptyState onPick={sendMessage} />
          ) : (
            <div className="space-y-5 max-w-3xl mx-auto">
              {messages.map((m, i) => (
                <div key={i} className={`message-in flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {m.role === 'user' ? <UserMark /> : <KaniMark />}
                  <div
                    className={`max-w-[75%] md:max-w-[65%] rounded-2xl px-4 py-3 text-sm leading-relaxed card-shadow ${
                      m.role === 'user'
                        ? 'bg-gradient-to-br from-[var(--color-teal)] to-[var(--color-teal-dim)] text-[var(--color-ink)] font-medium'
                        : 'notebook-lines bg-[var(--color-slate-2)] text-[var(--color-paper)] border border-white/[0.05] markdown-body'
                    }`}
                  >
                    {m.role === 'user' ? (
                      m.content
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="message-in flex gap-3">
                  <KaniMark />
                  <div className="notebook-lines bg-[var(--color-slate-2)] border border-white/[0.05] rounded-2xl card-shadow">
                    <TypingIndicator />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage() }}
          className="border-t border-[var(--color-border)] p-4 md:p-6"
        >
          <div className="max-w-3xl mx-auto flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Qor su'aashaada halkan..."
              className="flex-1 rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3.5 text-sm text-[var(--color-paper)] placeholder:text-[var(--color-mist)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]/60 focus:border-[var(--color-teal)]/40 transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dim)] text-[var(--color-ink)] font-display font-semibold text-sm disabled:opacity-50 hover:brightness-110 transition-all card-shadow"
            >
              Dir
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default App