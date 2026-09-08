import { useCallback, useEffect, useRef, useState } from 'react'
import IonIcon from './IonIcon'
import useFocusTrap from '../hooks/useFocusTrap'

const MAX_QUESTION_CHARS = 500

function messageFromApiError(status, data) {
  const detail = data?.detail
  const text = Array.isArray(detail)
    ? detail.map((item) => item.msg).filter(Boolean).join(' ')
    : typeof detail === 'string'
      ? detail
      : ''

  if (status === 429) {
    return text || 'You have sent too many questions. Please wait a moment and try again.'
  }
  if (status === 422) {
    return 'Please keep your question under 500 characters and try again.'
  }
  if (status === 503) {
    return 'The chatbot is temporarily unavailable. Please use the contact form or email usmanbukhari541@gmail.com.'
  }
  if (status === 502) {
    return text || 'I could not generate a reply just now. Please try again, or use the contact form.'
  }
  return "Sorry, I'm having trouble connecting right now. Please use the contact form to reach Usman."
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      fromUser: false,
      isError: false,
      text: "Hi! I'm Usman's AI assistant. Ask me about his experience, skills, or projects! 🚀"
    }
  ])
  const messagesRef = useRef(null)
  const windowRef = useRef(null)
  const inputRef = useRef(null)
  const closeChat = useCallback(() => setIsOpen(false), [])
  const remaining = MAX_QUESTION_CHARS - input.length
  const canSend = Boolean(input.trim()) && !isTyping && input.length <= MAX_QUESTION_CHARS

  useFocusTrap(isOpen, windowRef, closeChat, inputRef)

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const sendMessage = async () => {
    const message = input.trim()
    if (!message || isTyping) {
      return
    }

    if (message.length > MAX_QUESTION_CHARS) {
      setMessages((current) => [
        ...current,
        {
          id: `bot-error-${Date.now()}`,
          fromUser: false,
          isError: true,
          text: `Please keep your question under ${MAX_QUESTION_CHARS} characters.`
        }
      ])
      return
    }

    setMessages((current) => [...current, { id: `user-${Date.now()}`, fromUser: true, isError: false, text: message }])
    setInput('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setMessages((current) => [
          ...current,
          {
            id: `bot-error-${Date.now()}`,
            fromUser: false,
            isError: true,
            text: messageFromApiError(response.status, data)
          }
        ])
        return
      }
      setMessages((current) => [
        ...current,
        { id: `bot-${Date.now()}`, fromUser: false, isError: false, text: data.reply }
      ])
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `bot-error-${Date.now()}`,
          fromUser: false,
          isError: true,
          text: "I can't reach the chatbot server right now. Please try again, or use the contact form."
        }
      ])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="chatbot-container">
      <button
        className="chatbot-toggle"
        id="chatbot-toggle"
        type="button"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        aria-expanded={isOpen}
        aria-controls="chatbot-window"
        onClick={() => setIsOpen((open) => !open)}
      >
        <IonIcon name="chatbubble-outline" />
      </button>

      <div
        className="chatbot-window"
        id="chatbot-window"
        ref={windowRef}
        role="dialog"
        aria-modal="true"
        aria-label="Ask me about Usman"
        aria-busy={isTyping}
        aria-hidden={!isOpen}
        style={{ display: isOpen ? 'flex' : 'none' }}
        {...(!isOpen ? { inert: '' } : {})}
      >
        <div className="chatbot-header">
          <span>💬 Ask me about Usman</span>
          <button
            className="chatbot-close"
            id="chatbot-close"
            type="button"
            aria-label="Close chat"
            onClick={closeChat}
          >
            ×
          </button>
        </div>

        <div
          className="chatbot-messages"
          id="chatbot-messages"
          ref={messagesRef}
          aria-live="polite"
          aria-relevant="additions"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.fromUser ? 'user-message' : 'bot-message'}${message.isError ? ' chatbot-error' : ''}`}
              role={message.isError ? 'alert' : undefined}
            >
              {message.text}
            </div>
          ))}
        </div>

        {isTyping ? (
          <div className="typing-indicator" id="typing-indicator" role="status" aria-live="polite">
            <span className="typing-dots">Looking up Usman's work…</span>
          </div>
        ) : null}

        <div className="chatbot-input-container">
          <label className="visually-hidden" htmlFor="chatbot-input">
            Message
          </label>
          <input
            type="text"
            className="chatbot-input"
            id="chatbot-input"
            ref={inputRef}
            placeholder={isTyping ? 'Please wait…' : "Ask about Usman's work..."}
            autoComplete="off"
            maxLength={MAX_QUESTION_CHARS}
            disabled={isTyping}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                sendMessage()
              }
            }}
          />
          <button
            className="chatbot-send"
            id="chatbot-send"
            type="button"
            disabled={!canSend}
            onClick={sendMessage}
          >
            {isTyping ? 'Sending' : 'Send'}
          </button>
        </div>
        <p className={`chatbot-char-count${remaining <= 50 ? ' chatbot-char-count-warn' : ''}`}>
          {remaining} characters left
        </p>
      </div>
    </div>
  )
}
