import { useEffect, useRef, useState } from 'react'
import { apiFetch } from '../api'

/* ================= UTIL ================= */
function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0')
  const s = String(sec % 60).padStart(2, '0')
  return `${m}:${s}`
}

const DEFAULT_SETTINGS = {
  focusDuration: 25,
  shortBreak: 5,
}

/* ================= PAGE ================= */
function FocusModePage() {
  const savedSettings = JSON.parse(
    localStorage.getItem('focus_settings') || '{}'
  )
  const settings = { ...DEFAULT_SETTINGS, ...savedSettings }

  const [mode, setMode] = useState('idle') 
  // idle | focus | break

  const [secondsLeft, setSecondsLeft] = useState(
    settings.focusDuration * 60
  )

  const [studyUrl, setStudyUrl] = useState('')
  const [note, setNote] = useState('')
  const [sessionStartedAt, setSessionStartedAt] = useState(null)
  const [feedback, setFeedback] = useState('')

  const timerRef = useRef(null)
  const fullscreenRef = useRef(null)

  /* ================= TIMER ================= */
  useEffect(() => {
    if (mode === 'idle') return

    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleTimerEnd()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [mode])

  /* ================= TIMER END ================= */
  const handleTimerEnd = async () => {
    if (mode === 'focus') {
      await saveSession()

      exitFullscreen()
      setMode('break')
      setSecondsLeft(settings.shortBreak * 60)

      alert('Sesi fokus selesai 🎉\nSekarang waktunya istirahat.')

      setFeedback('Sesi fokus berhasil disimpan. Kerja bagus! 💪')
    } else if (mode === 'break') {
      setMode('idle')
      setSecondsLeft(settings.focusDuration * 60)

      alert('Waktu istirahat selesai ⏰\nSiap fokus kembali!')
    }
  }

  /* ================= FULLSCREEN ================= */
  const enterFullscreen = () => {
    fullscreenRef.current?.requestFullscreen?.()
  }

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    }
  }

  /* ================= SAVE SESSION ================= */
  const saveSession = async () => {
    try {
      await apiFetch('/focus', {
        method: 'POST',
        body: JSON.stringify({
          durationMinutes: settings.focusDuration,
          studyUrl,
          note,
          startedAt: sessionStartedAt,
          finishedAt: new Date().toISOString(),
        }),
      })
    } catch (err) {
      console.error(err)
    }
  }

  /* ================= START ================= */
  const startFocus = () => {
    if (!studyUrl.trim()) return alert('Masukkan link belajar')
    try {
      new URL(studyUrl)
    } catch {
      return alert('URL tidak valid')
    }

    setFeedback('')
    setSessionStartedAt(new Date().toISOString())
    setSecondsLeft(settings.focusDuration * 60)
    setMode('focus')

    setTimeout(enterFullscreen, 100)
  }

  /* ================= STOP MANUAL ================= */
  const stopAll = () => {
    clearInterval(timerRef.current)
    exitFullscreen()
    setMode('idle')
    setSecondsLeft(settings.focusDuration * 60)
  }

  /* ================= UI ================= */
  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
      {/* ================= CARD ================= */}
      <div style={cardStyle}>
        <h2>Focus Mode</h2>

        <input
          placeholder="https://contoh.com"
          value={studyUrl}
          onChange={e => setStudyUrl(e.target.value)}
          style={inputStyle}
        />

        <div style={timerStyle}>{formatTime(secondsLeft)}</div>

        <div style={{ marginBottom: 12, color: '#64748b' }}>
          {mode === 'focus' && 'Sedang fokus'}
          {mode === 'break' && 'Waktu istirahat'}
          {mode === 'idle' && 'Siap memulai'}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={startFocus} style={startBtn}>
            Mulai Fokus
          </button>
          <button onClick={stopAll} style={stopBtn}>
            Stop
          </button>
        </div>

        <textarea
          placeholder="Catatan (opsional)"
          value={note}
          onChange={e => setNote(e.target.value)}
          style={textareaStyle}
        />

        {/* FEEDBACK */}
        {feedback && (
          <div style={feedbackStyle}>
            {feedback}
          </div>
        )}
      </div>

      {/* ================= FULLSCREEN FOCUS ================= */}
      {mode === 'focus' && (
        <div ref={fullscreenRef} style={fullscreenStyle}>
          <iframe
            src={studyUrl}
            title="study"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />

          <div style={overlayStyle}>
            <strong>{formatTime(secondsLeft)}</strong>
            <button onClick={stopAll} style={exitBtn}>
              Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ================= STYLES ================= */
const cardStyle = {
  background: '#f8f5f0',
  padding: 32,
  borderRadius: 20,
  width: 420,
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  textAlign: 'center',
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid #cbd5e1',
  marginBottom: 16,
}

const timerStyle = {
  fontSize: 56,
  fontWeight: 700,
  marginBottom: 12,
}

const textareaStyle = {
  width: '100%',
  marginTop: 16,
  padding: 12,
  borderRadius: 10,
  border: '1px solid #cbd5e1',
}

const startBtn = {
  flex: 1,
  padding: '10px 0',
  borderRadius: 999,
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
}

const stopBtn = {
  flex: 1,
  padding: '10px 0',
  borderRadius: 999,
  background: '#e5e7eb',
  border: 'none',
  cursor: 'pointer',
}

const fullscreenStyle = {
  position: 'fixed',
  inset: 0,
  background: '#000',
  zIndex: 99999,
}

const overlayStyle = {
  position: 'fixed',
  top: 20,
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(0,0,0,0.7)',
  color: '#fff',
  padding: '10px 18px',
  borderRadius: 999,
  display: 'flex',
  gap: 16,
  alignItems: 'center',
}

const exitBtn = {
  background: '#ef4444',
  color: '#fff',
  border: 'none',
  borderRadius: 999,
  padding: '6px 14px',
  cursor: 'pointer',
}

const feedbackStyle = {
  marginTop: 16,
  padding: 12,
  background: '#dcfce7',
  color: '#166534',
  borderRadius: 10,
  fontWeight: 600,
}

export default FocusModePage
