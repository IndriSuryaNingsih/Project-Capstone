import { useEffect, useState } from 'react'

function DisplaySettingsPage() {
  const [mode, setMode] = useState('light')

  useEffect(() => {
    const stored = window.localStorage.getItem('asah_display_mode')
    if (stored) setMode(stored)
  }, [])

  useEffect(() => {
    window.localStorage.setItem('asah_display_mode', mode)
  }, [mode])

  return (
    <div className="page">
      <h2>Display</h2>
      <p className="page-sub">
        Pengaturan tampilan basic. Di sini kamu bisa pilih antara mode
        Light dan Cozy (masih palet warna yang sama).
      </p>

      <div className="card">
        <div className="display-row">
          <label>
            <input
              type="radio"
              checked={mode === 'light'}
              onChange={() => setMode('light')}
            />
            <span>Light (default)</span>
          </label>
        </div>
        <div className="display-row">
          <label>
            <input
              type="radio"
              checked={mode === 'cozy'}
              onChange={() => setMode('cozy')}
            />
            <span>Cozy (font sedikit lebih besar)</span>
          </label>
        </div>
        
      </div>
    </div>
  )
}

export default DisplaySettingsPage
