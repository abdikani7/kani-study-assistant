import express from 'express'
import cors from 'cors'
import 'dotenv/config'

const app = express()
app.use(cors())
app.use(express.json())

const GROQ_API_KEY = process.env.GROQ_API_KEY
const MODEL = 'llama-3.1-8b-instant' // free, fast model on Groq

const SYSTEM_PROMPT = `Waxaad tahay "Kani Study", caawiye waxbarasho oo ku hadla af-Soomaali.
Waxaad caawisaa ardayda Computer Science iyo mowduucyada kale ee waxbarasho.
Ka jawaab si cad, kooban, oo af-Soomaali ah, adigoo isticmaalaya tusaalayaal marka ay khasab tahay.
Haddii su'aasha ay ku qornaan tahay Ingiriisi, waad ku jawaabi kartaa Ingiriisi, laakiin default-ka waa af-Soomaali.`

app.post('/api/chat', async (req, res) => {
  try {
    if (!GROQ_API_KEY) {
      return res.status(500).json({ error: 'GROQ_API_KEY lama helin. Fadlan dhig .env file-ka server-ka.' })
    }

    const { messages } = req.body
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages waa in ay noqotaa array' })
    }

    const groqMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ]

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Groq API error:', data)
      return res.status(response.status).json({ error: data.error?.message || 'Groq API error' })
    }

    const reply = data.choices?.[0]?.message?.content ?? 'Ma helin jawaab.'
    res.json({ reply })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server wuxuu ka shaqeynayaa http://localhost:${PORT}`)
})
