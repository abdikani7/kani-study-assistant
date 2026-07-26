import { useState, useRef, useEffect } from 'react'

const SUGGESTED_TOPICS = [
  'Sharax algorithm-ka Binary Search',
  'Waa maxay OOP (Object-Oriented Programming)?',
  'Kala sooc TCP iyo UDP',
  'Sida loo xisaabiyo Big-O notation',
  'Sharax normalization database-ka',
]

function TypingIndicator() {
  return (
    <div className="flex gap-1.5 px-4 py-3">
      <span className="w-2 h-2 rounded-full bg-[var(--color-gold)] typing-dot" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 rounded-full bg-[var(--color-gold)] typing-dot" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 rounded-full bg-[var(--color-gold)] typing-dot" style={{ animationDelay: '300ms' }} />
    </div>
  )
}

function App() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Salaan! Waxaan ahay Kani Study, caawiyahaaga waxbarasho. I weydii su\'aal ku saabsan CS, math, ama mowduuc kasta oo aad barato — waan kaa caawin doonaa af-Soomaali.',
    },
  ])
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
      const res = await fetch('/api/chat', {
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

  return (
    <div className="h-full flex bg-[var(--color-ink)]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-r border-white/10 bg-[var(--color-slate)] p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-md bg-[var(--color-teal)] flex items-center justify-center font-display font-bold text-[var(--color-ink)]">K</div>
          <span className="font-display text-lg tracking-tight">Kani Study</span>
        </div>

        <p className="text-xs uppercase tracking-wider text-[var(--color-mist)] mb-3">Su'aalo soo jeediyay</p>
        <div className="flex flex-col gap-2">
          {SUGGESTED_TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => sendMessage(topic)}
              className="text-left text-sm px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-[var(--color-paper)]/90"
            >
              {topic}
            </button>
          ))}
        </div>

        <div className="mt-auto text-xs text-[var(--color-mist)]">
          Powered by Abdikani — bilaash oo dhaqso ah
        </div>
      </aside>

      {/* Main chat */}
      <main className="flex-1 flex flex-col">
        <header className="md:hidden flex items-center gap-2 px-4 py-3 border-b border-white/10">
          <div className="w-7 h-7 rounded-md bg-[var(--color-teal)] flex items-center justify-center font-display font-bold text-[var(--color-ink)] text-sm">K</div>
          <span className="font-display">Kani Study</span>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-10 py-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] md:max-w-[65%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[var(--color-teal)] text-[var(--color-ink)] font-medium'
                    : 'notebook-lines bg-[var(--color-slate)] text-[var(--color-paper)]'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="notebook-lines bg-[var(--color-slate)] rounded-2xl">
                <TypingIndicator />
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage() }}
          className="border-t border-white/10 p-4 flex gap-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Qor su'aashaada halkan..."
            className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-[var(--color-paper)] placeholder:text-[var(--color-mist)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-[var(--color-gold)] text-[var(--color-ink)] font-semibold text-sm disabled:opacity-50"
          >
            Dir
          </button>
        </form>
      </main>
    </div>
  )
}

export default App
