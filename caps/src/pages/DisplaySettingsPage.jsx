import { useEffect, useState } from 'react'

function DisplaySettingsPage() {
  const [mode, setMode] = useState('light')

  // Ambil mode dari localStorage saat pertama load
  useEffect(() => {
    const stored = window.localStorage.getItem('asah_display_mode')
    if (stored) {
      setMode(stored)
      document.body.className = stored
    }
  }, [])

  // Simpan & terapkan mode setiap kali berubah
  useEffect(() => {
    window.localStorage.setItem('asah_display_mode', mode)

    // bersihkan class lama lalu pasang yang baru
    document.body.classList.remove('light', 'cozy')
    document.body.classList.add(mode)
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
              name="display-mode"
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
              name="display-mode"
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
