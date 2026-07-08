import { useState } from 'react'
import { BC_CHAT_RESPONSES } from '../data.js'

function getBotReply(input) {
  const lower = input.toLowerCase()
  for (const key of Object.keys(BC_CHAT_RESPONSES)) {
    if (key !== 'default' && lower.includes(key)) return BC_CHAT_RESPONSES[key]
  }
  return BC_CHAT_RESPONSES['default']
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hi! 👋 I'm your BloodCare AI assistant. I can help you find donors, check blood compatibility, or learn about donation. How can I help?" }
  ])
  const [input, setInput] = useState('')

  const send = () => {
    const val = input.trim()
    if (!val) return
    setMessages(prev => [...prev, { type: 'user', text: val }])
    setInput('')
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text: '🤔 Let me check that for you…' }])
      setTimeout(() => {
        const reply = getBotReply(val)
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { type: 'bot', text: reply, html: true }
          return updated
        })
      }, 900)
    }, 300)
  }

  return (
    <>
      <button id="ai-chat-btn" onClick={() => setOpen(o => !o)} aria-label="Open AI Blood Assistant" title="AI Blood Assistant">🤖</button>
      <div className={`chatbot-panel${open ? ' open' : ''}`} id="chatPanel" role="dialog" aria-label="AI Blood Assistant">
        <div className="chat-header">
          <div className="avatar avatar-sm" style={{ background: '#fff', color: 'var(--primary)' }}>🤖</div>
          <div>
            <p className="font-semibold" style={{ fontSize: '0.9rem' }}>BloodCare AI</p>
            <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>Always here to help</p>
          </div>
          <button style={{ marginLeft: 'auto', color: '#fff', fontSize: '1.1rem' }} onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
        </div>
        <div className="chat-messages" id="chatMessages">
          {messages.map((m, i) => (
            m.html
              ? <div key={i} className={`chat-msg ${m.type}`} dangerouslySetInnerHTML={{ __html: m.text }} />
              : <div key={i} className={`chat-msg ${m.type}`}>{m.text}</div>
          ))}
        </div>
        <div className="chat-input-row">
          <input
            type="text"
            id="chatInput"
            placeholder="Ask me anything…"
            aria-label="Chat message"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
          />
          <button className="chat-send" id="chatSend" onClick={send} aria-label="Send message">➤</button>
        </div>
      </div>
    </>
  )
}
