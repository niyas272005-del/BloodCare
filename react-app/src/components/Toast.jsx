import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function useToast() {
  return useContext(ToastContext)
}

let globalShowToast = null
export function showToast(message, type = 'success', duration = 3500) {
  if (globalShowToast) globalShowToast(message, type, duration)
}

export default function Toast() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  globalShowToast = addToast

  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' }

  return (
    <div className="toast-container" id="toastContainer" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type !== 'success' ? t.type : ''}`}>
          <span style={{ fontSize: '1.2rem' }}>{icons[t.type] || '✅'}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}
