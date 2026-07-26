# Kani Study — Somali Study Assistant 🎓

AI-powered chat assistant oo af-Soomaali ku caawiya ardayda mowduucyada CS iyo waxbarasho guud.

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS v4
- **Backend:** Node.js + Express (proxy server)
- **AI:** Groq API (Llama 3.1 8B — free tier, dhaqso badan)

## Sida loo Deggan Yahay (Local Setup)

### 1. Hel Groq API Key (bilaash)
1. Tag [console.groq.com](https://console.groq.com)
2. Isku diiwaan geli (free account)
3. Tag **API Keys** oo samee key cusub
4. Koobiyee key-ga

### 2. Server-ka
```bash
cd server
npm install
cp .env.example .env
# Ku dar GROQ_API_KEY-gaaga .env file-ka
npm run dev
```
Server-ku wuxuu ka shaqeyn doonaa `http://localhost:5000`

### 3. Client-ka
```bash
cd client
npm install
npm run dev
```
Client-ku wuxuu ka shaqeyn doonaa `http://localhost:5173`

## Structure
```
somali-study-assistant/
├── client/          # React frontend
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
└── server/          # Express backend (proxies Groq API)
    └── index.js
```

## Deploy
- **Frontend:** Vercel ama Netlify (root: `client`)
- **Backend:** Render ama Railway (root: `server`, dar `GROQ_API_KEY` environment variable)

## Sawirro (Screenshots)
_Ku dar screenshot-yo halkan marka aad deploy garayso._

## Waxa soo socda
- [ ] Chat history persistence (localStorage ama database)
- [ ] Voice input/output
- [ ] Mowduucyo dheeraad ah oo la doorto
