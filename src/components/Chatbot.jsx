import { useCallback, useEffect, useRef, useState } from 'react'
import IonIcon from './IonIcon'
import { getMockResponse } from '../legacy/chatbot'
import useFocusTrap from '../hooks/useFocusTrap'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      fromUser: false,
      text: "Hi! I'm Usman's AI assistant. Ask me about his experience, skills, or projects! 🚀"
    }
  ])
  const messagesRef = useRef(null)
  const windowRef = useRef(null)
  const inputRef = useRef(null)
  const closeChat = useCallback(() => setIsOpen(false), [])

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

    setMessages((current) => [...current, { id: `user-${Date.now()}`, fromUser: true, text: message }])
    setInput('')
    setIsTyping(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))
      const reply = getMockResponse(message)
      setMessages((current) => [...current, { id: `bot-${Date.now()}`, fromUser: false, text: reply }])
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `bot-error-${Date.now()}`,
          fromUser: false,
          text: "Sorry, I'm having trouble connecting right now. Please use the contact form below to reach Usman directly!"
        }
      ])
      console.error('Chatbot error:', error)
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
            <div key={message.id} className={`message ${message.fromUser ? 'user-message' : 'bot-message'}`}>
              {message.text}
            </div>
          ))}
        </div>

        {isTyping ? (
          <div className="typing-indicator" id="typing-indicator" role="status" aria-live="polite">
            <span className="typing-dots">Assistant is typing...</span>
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
            placeholder="Ask about Usman's work..."
            autoComplete="off"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                sendMessage()
              }
            }}
          />
          <button className="chatbot-send" id="chatbot-send" type="button" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
