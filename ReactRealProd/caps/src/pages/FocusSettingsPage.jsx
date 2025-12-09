import { useEffect, useState } from 'react'

const DEFAULT_FOCUS_MINUTES = 25
const DEFAULT_SHORT_MINUTES = 5
const DEFAULT_LONG_MINUTES = 10

function FocusSettingsPage() {
  const [focusMinutes, setFocusMinutes] = useState(DEFAULT_FOCUS_MINUTES)
  const [longMinutes, setLongMinutes] = useState(DEFAULT_LONG_MINUTES)
  const [useCustomLong, setUseCustomLong] = useState(false)

  useEffect(() => {
    const storedFocus = window.localStorage.getItem('asah_focus_minutes')
    const storedLong = window.localStorage.getItem('asah_long_minutes')
    const storedCustom = window.localStorage.getItem('asah_long_custom')

    if (storedFocus) {
      setFocusMinutes(Number(storedFocus) || DEFAULT_FOCUS_MINUTES)
    }
    if (storedLong) {
      setLongMinutes(Number(storedLong) || DEFAULT_LONG_MINUTES)
    }
    if (storedCustom) {
      setUseCustomLong(storedCustom === '1')
    }
  }, [])

  const handleSave = (e) => {
    e.preventDefault()

    const safeFocus = Math.min(Math.max(focusMinutes, 5), 120)
    const safeLong = Math.min(Math.max(longMinutes, 5), 120)

    setFocusMinutes(safeFocus)
    setLongMinutes(safeLong)

    window.localStorage.setItem('asah_focus_minutes', String(safeFocus))
    window.localStorage.setItem('asah_focus_seconds', String(safeFocus * 60))
    window.localStorage.setItem('asah_long_minutes', String(safeLong))
    window.localStorage.setItem('asah_long_custom', useCustomLong ? '1' : '0')

    alert('Pengaturan fokus & break disimpan (dummy, hanya di browser ini).')
  }

  const handleReset = () => {
    setFocusMinutes(DEFAULT_FOCUS_MINUTES)
    setLongMinutes(DEFAULT_LONG_MINUTES)
    setUseCustomLong(false)

    window.localStorage.setItem('asah_focus_minutes', String(DEFAULT_FOCUS_MINUTES))
    window.localStorage.setItem('asah_focus_seconds', String(DEFAULT_FOCUS_MINUTES * 60))
    window.localStorage.setItem('asah_long_minutes', String(DEFAULT_LONG_MINUTES))
    window.localStorage.setItem('asah_long_custom', '0')
  }

  const formatTime = (m) => `${String(m).padStart(2, '0')}:00`

  return (
    <div className="page">
      <h2>Pengaturan waktu Focus Mode</h2>
      <p className="page-sub">
        Atur durasi sesi fokus, serta long break sesuai kebutuhan. Short break tetap default {DEFAULT_SHORT_MINUTES}{' '}
        menit seperti di desain.
      </p>

      <div className="card focus-settings-card">
        <form onSubmit={handleSave} className="focus-settings-layout">
          <div className="focus-time-picker">
            <div className="focus-time-main">
              <div className="focus-time-label">Timer (Fokus)</div>
              <div className="focus-time-control">
                <button
                  type="button"
                  onClick={() => setFocusMinutes((m) => Math.max(5, m - 1))}
                  className="time-step-btn"
                >
                  ▲
                </button>
                <div className="focus-time-value">
                  {String(focusMinutes).padStart(2, '0')} : 00
                </div>
                <button
                  type="button"
                  onClick={() => setFocusMinutes((m) => Math.min(120, m + 1))}
                  className="time-step-btn"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>

          <div className="focus-time-summary">
            <div className="summary-row">
              <span>Timer</span>
              <span>{formatTime(focusMinutes)}</span>
            </div>
            <div className="summary-row">
              <span>Short break</span>
              <span>Default ({formatTime(DEFAULT_SHORT_MINUTES)})</span>
            </div>
            <div className="summary-row">
              <span>Long break</span>
              <span>{useCustomLong ? formatTime(longMinutes) : `${formatTime(DEFAULT_LONG_MINUTES)} (default)`}</span>
            </div>
          </div>

          <div className="long-break-config">
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={useCustomLong}
                onChange={(e) => setUseCustomLong(e.target.checked)}
              />
              <span>Aktifkan custom long break</span>
            </label>
            {useCustomLong && (
              <div className="long-break-input-row">
                <span>Durasi long break (menit)</span>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={longMinutes}
                  onChange={(e) => setLongMinutes(Number(e.target.value))}
                />
              </div>
            )}
          </div>

          <div className="focus-settings-buttons">
            <button type="button" className="btn-red" onClick={handleReset}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FocusSettingsPage
