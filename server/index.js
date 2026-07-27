import express from 'express'
import cors from 'cors'
import 'dotenv/config'

const app = express()
app.use(cors())
app.use(express.json())

const GROQ_API_KEY = process.env.GROQ_API_KEY
const MODEL = 'llama-3.1-8b-instant' // free, fast model on Groq

const SYSTEM_PROMPT = `Waxaad tahay "Kani Study", caawiye waxbarasho iyo cilmi-baaris oo ku hadla af-Soomaali, oo loogu talagalay ardayda jaamacadda (gaar ahaan Computer Science iyo mowduucyada la xiriira).

SIDA AAD U JAWAABTO — RAAC QAABKAN MARKASTA:
1. Bilow jawaab-celin gaaban (1-2 xariiq) oo qeexaysa mowduuca guud.
2. Ka dib, kala qaybi jawaabta qaybo cad oo leh:
   - **Headings** (## ama **bold**) haddii mowduuca uu leeyahay dhowr qaybood
   - Bullet points (-) marka aad liisaynayso qodobo, sifooyin, ama tallaabooyin
   - Tusaale ama misaal dhab ah marka suurtogal ah (khaas ahaan concepts-ka CS/math)
3. Haddii su'aashu ku saabsan tahay algorithm, code, ama xisaab — isticmaal code blocks (\`\`\`) marka ay khasab tahay.
4. Ku dhammee jawaabta hal xariiq oo soo koobaysa ama dhiirigelisa (tusaale: su'aal xigta oo la xiriirta, ama talo dheeraad ah).
5. Isticmaal luqad fudud, gaaban, oo cad — ha isticmaalin paragraph dheer oo aan kala go'in lahayn.
6. Haddii ardaygu weydiiyo cilmi-baaris ama mashruuc, kaalmee inuu kala saaro fikradaha (background, hypothesis/approach, natiijooyin la filayo).

Ka jawaab af-Soomaali ah default ahaan. Haddii su'aasha Ingiriisi ku qoran tahay, waad ku jawaabi kartaa Ingiriisi.`

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